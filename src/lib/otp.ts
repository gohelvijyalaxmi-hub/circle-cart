type SendResponse =
  | { ok: true; devCode?: string; expiresIn: number; delivery?: unknown }
  | { ok?: false; error: string };

type VerifyResponse = { ok: true } | { ok?: false; error: string; attemptsLeft?: number };

// Base API URL: default same-origin, override with VITE_API_URL
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
const FALLBACK_BASE = 'http://127.0.0.1:3001';

async function callApi<T>(
  path: string,
  body: unknown
): Promise<{ data: T; ok: boolean; status: number }> {
  const attempt = async (base: string) => {
    const res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let parsed: any = {};
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { error: text };
      }
    }
    return { res, parsed };
  };

  // 1st try: configured base (or same-origin)
  try {
    const { res, parsed } = await attempt(API_BASE);
    return { data: parsed as T, ok: res.ok, status: res.status };
  } catch (err) {
    // 2nd try: fallback localhost backend (helps when proxy/host mismatched)
    const { res, parsed } = await attempt(FALLBACK_BASE);
    return { data: parsed as T, ok: res.ok, status: res.status };
  }
}

export async function requestOtp(contact: string): Promise<SendResponse> {
  const { data, ok } = await callApi<SendResponse>('/api/otp/send', { contact });
  if (!ok) throw new Error((data as any)?.error || 'Send failed');
  return data;
}

export async function verifyOtp(input: { contact: string; code: string }): Promise<VerifyResponse> {
  const { data, ok } = await callApi<VerifyResponse>('/api/otp/verify', input);
  if (!ok) throw new Error((data as any)?.error || 'Verification failed');
  return data;
}
