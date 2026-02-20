// Lightweight OTP backend for local dev and staging.
// Features:
// - 5 minute code TTL, 3 sends / 10 minutes, 5 verify attempts
// - SMS via Twilio if phone number and Twilio env vars are set
// - Email via SendGrid if email and SendGrid env vars are set
// - Optional dev echo: set DEV_OTP_ECHO=true to return the code in the response (use ONLY locally)
// Run: PORT=3001 node server/otpServer.mjs

import express from 'express';
import { webcrypto } from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const {
  PORT = 3001,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM,
  SENDGRID_API_KEY,
  SENDGRID_FROM,
  DEV_OTP_ECHO,
} = process.env;
const smsConfigured = !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM);
const emailConfigured = !!(SENDGRID_API_KEY && SENDGRID_FROM);
const providersConfigured = smsConfigured || emailConfigured;
const shouldEcho = DEV_OTP_ECHO === 'true' || !providersConfigured; // auto-echo locally if no provider

// In-memory stores
const otpStore = new Map(); // contact -> { code, expiresAt, attempts }
const sendHistory = new Map(); // contact -> [timestamps]

// Limits
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_SENDS_PER_WINDOW = 3;
const CODE_TTL_MS = 5 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;

// Validation
const phoneRegex = /^\+?\d{8,15}$/;
const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const isValidContact = (value) => phoneRegex.test(value) || emailRegex.test(value);

// Helpers
const generateCode = () => {
  const buffer = new Uint32Array(1);
  webcrypto.getRandomValues(buffer);
  return String((buffer[0] % 900000) + 100000);
};

const recordSend = (contact) => {
  const now = Date.now();
  const list = sendHistory.get(contact) || [];
  const fresh = list.filter((t) => now - t < RATE_WINDOW_MS);
  fresh.push(now);
  sendHistory.set(contact, fresh);
  return fresh.length;
};

const canSend = (contact) => {
  const now = Date.now();
  const list = sendHistory.get(contact) || [];
  const fresh = list.filter((t) => now - t < RATE_WINDOW_MS);
  return fresh.length < MAX_SENDS_PER_WINDOW;
};

async function sendSms(to, code) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) return { delivered: false, reason: 'Twilio not configured' };

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const body = new URLSearchParams({
    From: TWILIO_FROM,
    To: to,
    Body: `Your verification code is ${code}. It expires in 5 minutes.`,
  });
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twilio error: ${text}`);
  }
  return { delivered: true };
}

async function sendEmail(to, code) {
  if (!SENDGRID_API_KEY || !SENDGRID_FROM) return { delivered: false, reason: 'SendGrid not configured' };

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: SENDGRID_FROM },
      subject: 'Your verification code',
      content: [{ type: 'text/plain', value: `Your verification code is ${code}. It expires in 5 minutes.` }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SendGrid error: ${text}`);
  }
  return { delivered: true };
}

app.post('/api/otp/send', async (req, res) => {
  const { contact } = req.body || {};
  if (!contact || !isValidContact(contact)) {
    return res.status(400).json({ error: 'Invalid contact' });
  }
  if (!canSend(contact)) {
    return res.status(429).json({ error: 'Too many requests. Try again later.' });
  }

  const code = generateCode();
  const expiresAt = Date.now() + CODE_TTL_MS;
  otpStore.set(contact, { code, expiresAt, attempts: 0 });
  recordSend(contact);

  try {
    let delivery = { delivered: false, reason: 'No provider configured' };
    if (phoneRegex.test(contact)) {
      delivery = await sendSms(contact, code);
    } else {
      delivery = await sendEmail(contact, code);
    }

    if (!delivery.delivered && !shouldEcho) {
      return res.status(502).json({ error: 'Delivery failed (provider not configured).' });
    }

    const payload = { ok: true, expiresIn: CODE_TTL_MS / 1000 };
    if (shouldEcho) {
      payload.devCode = code;
      payload.delivery = delivery;
    }
    return res.status(200).json(payload);
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: 'Delivery failed. Please try again.' });
  }
});

app.post('/api/otp/verify', (req, res) => {
  const { contact, code } = req.body || {};
  if (!contact || !code) return res.status(400).json({ error: 'Missing contact or code' });
  const entry = otpStore.get(contact);
  if (!entry) return res.status(400).json({ error: 'No code sent or it expired' });

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(contact);
    return res.status(400).json({ error: 'Code expired' });
  }

  entry.attempts += 1;
  if (entry.attempts > MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(contact);
    return res.status(429).json({ error: 'Too many attempts. Request a new code.' });
  }

  if (code !== entry.code) {
    otpStore.set(contact, entry);
    return res.status(400).json({ error: 'Incorrect code', attemptsLeft: MAX_VERIFY_ATTEMPTS - entry.attempts });
  }

  otpStore.delete(contact);
  return res.status(200).json({ ok: true });
});

app.get('/api/otp/health', (_req, res) => {
  res.json({
    ok: true,
    provider: {
      sms: smsConfigured,
      email: emailConfigured,
    },
    echo: shouldEcho,
  });
});

app.listen(PORT, () => {
  console.log(`OTP server running on http://localhost:${PORT}`);
});
