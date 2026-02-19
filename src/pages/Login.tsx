import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Store, ShieldCheck, Sparkles, Zap, CheckCircle2, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/layout/Logo';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithCredentials } = useApp();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleSendCode = () => {
    const contactValue = contact.trim();
    if (!contactValue) {
      toast({
        title: 'Contact required',
        description: 'Please enter mobile number or email first.',
        variant: 'destructive',
      });
      return;
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(code);
    setIsCodeSent(true);
    setIsVerified(false);
    setVerificationCode('');
    setVerificationError('');

    // Demo-only code delivery simulation.
    toast({
      title: 'Code sent',
      description: `Verification code sent to ${contactValue}. Demo code: ${code}`,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !contact.trim()) {
      toast({
        title: 'Missing details',
        description: 'Please enter username and mobile number or email.',
        variant: 'destructive',
      });
      return;
    }

    if (!isVerified) {
      const enteredCode = verificationCode.trim();
      if (isCodeSent && enteredCode && enteredCode !== sentCode) {
        toast({
          title: 'Invalid verification code',
          description: 'The code you entered is incorrect. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Verification required',
        description: 'Please complete verification before login.',
        variant: 'destructive',
      });
      return;
    }

    loginWithCredentials(username);
    toast({
      title: mode === 'login' ? 'Login successful' : 'Account created',
      description: mode === 'login' ? 'Welcome back to City Connect.' : 'You are all set to start selling and buying.',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-background flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6">
        {/* Left: form */}
        <div className="marketplace-card p-6 lg:p-8 shadow-lg animate-fade-in order-2 lg:order-1">
          <div className="text-center mb-6 space-y-3">
            <Logo className="justify-center" size={48} />
            <div className="inline-flex rounded-xl bg-secondary p-1 border border-border">
              <Button
                type="button"
                size="sm"
                variant={mode === 'login' ? 'default' : 'ghost'}
                className="rounded-lg"
                onClick={() => setMode('login')}
              >
                Login
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === 'signup' ? 'default' : 'ghost'}
                className="rounded-lg"
                onClick={() => setMode('signup')}
              >
                Sign up
              </Button>
            </div>
            <h2 className="text-2xl font-bold text-foreground mt-4">
              {mode === 'login' ? 'Login' : 'Create your account'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your details to continue. Verification runs automatically.
            </p>
          </div>

          {/* Sponsored banner */}
          <div className="mb-6 p-4 rounded-lg border border-border bg-secondary/60 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Limited-time promo</p>
              <p className="text-xs text-muted-foreground">Post your first listing for free and boost it to the top of your city feed.</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 px-3">
              Know More
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name or handle"
                className="mt-1.5 input-marketplace"
              />
            </div>
            <div>
              <Label htmlFor="contact">Mobile Number or Email</Label>
              <div className="mt-1.5 flex gap-2">
                <Input
                  id="contact"
                  type="text"
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    if (isCodeSent || isVerified) {
                      setIsCodeSent(false);
                      setIsVerified(false);
                      setSentCode('');
                      setVerificationCode('');
                      setVerificationError('');
                    }
                  }}
                  placeholder="+91XXXXXXXXXX or you@example.com"
                  className="input-marketplace"
                />
                <Button type="button" variant="outline" onClick={handleSendCode} className="whitespace-nowrap">
                  {isCodeSent ? 'Resend Code' : 'Get Code'}
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border p-3 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">Verification</p>
                {isVerified && <span className="text-xs text-success font-medium">Verified</span>}
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                We auto-check your code as you type.
              </p>
              <Input
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value;
                  setVerificationCode(value);

                  if (!isCodeSent) {
                    setIsVerified(false);
                    setVerificationError('');
                    return;
                  }

                  const enteredCode = value.trim();
                  if (!enteredCode) {
                    setIsVerified(false);
                    setVerificationError('');
                    return;
                  }

                  if (enteredCode === sentCode) {
                    const wasVerified = isVerified;
                    setIsVerified(true);
                    setVerificationError('');
                    if (!wasVerified) {
                      toast({
                        title: 'Verification complete',
                        description: 'Code matched. You can now login.',
                      });
                    }
                    return;
                  }

                  setIsVerified(false);
                  if (sentCode && enteredCode.length >= sentCode.length) {
                    setVerificationError('Incorrect code. Please try again.');
                  } else {
                    setVerificationError('');
                  }
                }}
                placeholder="Verification code"
                className="input-marketplace"
                disabled={!isCodeSent}
              />
              {verificationError && (
                <p className="text-xs text-destructive mt-2">{verificationError}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-11" size="lg">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>

            <p className="text-[11px] text-muted-foreground text-center">
              By continuing you agree to community rules and fair-trade policies.
            </p>
          </form>
        </div>

        {/* Right: hero / selling points */}
        <div className="marketplace-card relative overflow-hidden p-6 lg:p-8 order-1 lg:order-2">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary))/0.45,transparent_35%),radial-gradient(circle_at_80%_0%,hsl(var(--accent))/0.4,transparent_30%),radial-gradient(circle_at_60%_70%,hsl(var(--primary))/0.25,transparent_35%)]" />
          <div className="relative flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl marketplace-header flex items-center justify-center shadow-md">
              <Store className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">City Connect</p>
              <h2 className="text-lg font-bold text-foreground">Trusted local marketplace</h2>
            </div>
          </div>
          <h1 className="text-3xl font-black text-foreground leading-tight">
            Sign in and reach thousands of nearby buyers & sellers
          </h1>
          <p className="text-muted-foreground mt-3 text-sm lg:text-base">
            Secure identity checks, fast chat, and curated city listings keep every deal smooth.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {[
              { icon: ShieldCheck, title: 'Safe & secure', desc: 'Protected chat and identity checks.' },
              { icon: Sparkles, title: 'Curated nearby', desc: 'Only the best listings in your city.' },
              { icon: Zap, title: 'Instant alerts', desc: 'Price drops and new matches in seconds.' },
              { icon: CheckCircle2, title: 'Verified sellers', desc: 'Higher trust, better deals.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-secondary/60 border border-border rounded-lg p-3">
                <item.icon className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-secondary border border-border">24/7 support</span>
            <span className="px-3 py-1 rounded-full bg-secondary border border-border">No listing fees</span>
            <span className="px-3 py-1 rounded-full bg-secondary border border-border">Secure payments (soon)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
