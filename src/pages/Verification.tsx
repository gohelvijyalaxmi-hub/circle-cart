import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Shield, Upload, CheckCircle2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BottomNav } from '@/components/layout/BottomNav';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type VerificationStep = 'phone' | 'otp' | 'id' | 'complete';

export default function Verification() {
  const { toast } = useToast();
  const [step, setStep] = useState<VerificationStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [idUploaded, setIdUploaded] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      toast({
        title: 'OTP Sent',
        description: 'A verification code has been sent to your phone.',
      });
      setStep('otp');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Check if complete
    if (newOtp.every((digit) => digit !== '')) {
      setTimeout(() => {
        toast({
          title: 'Phone Verified',
          description: 'Your phone number has been verified.',
        });
        setStep('id');
      }, 500);
    }
  };

  const handleIdUpload = () => {
    setIdUploaded(true);
    setTimeout(() => {
      toast({
        title: 'ID Uploaded',
        description: 'Your ID is being reviewed.',
      });
      setStep('complete');
    }, 1000);
  };

  const steps = [
    { key: 'phone', label: 'Phone', icon: Phone },
    { key: 'otp', label: 'Verify', icon: Shield },
    { key: 'id', label: 'ID', icon: Upload },
    { key: 'complete', label: 'Done', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-4 safe-top">
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">Verification</h1>
        </div>
      </header>

      {/* Progress */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={s.key} className="flex items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                    isCompleted
                      ? 'bg-success text-success-foreground'
                      : isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-12 h-1 mx-2 rounded-full transition-colors',
                      index < currentStepIndex ? 'bg-success' : 'bg-secondary'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((s) => (
            <span key={s.key} className="text-xs text-muted-foreground">
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4">
        {/* Phone step */}
        {step === 'phone' && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Verify Your Phone</h2>
              <p className="text-muted-foreground text-sm mt-1">
                We'll send a verification code to your phone
              </p>
            </div>
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex mt-1.5">
                  <span className="inline-flex items-center px-4 bg-secondary rounded-l-xl border-r border-border text-muted-foreground">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter your phone number"
                    className="rounded-l-none input-marketplace"
                    maxLength={10}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12" disabled={phone.length < 10}>
                Send OTP
              </Button>
            </form>
          </div>
        )}

        {/* OTP step */}
        {step === 'otp' && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Enter OTP</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Enter the 6-digit code sent to +91 {phone}
              </p>
            </div>
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-bold input-marketplace"
                  maxLength={1}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full text-primary"
              onClick={() => {
                toast({ title: 'OTP Resent' });
              }}
            >
              Resend OTP
            </Button>
          </div>
        )}

        {/* ID step */}
        {step === 'id' && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Upload ID</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Upload a government-issued ID for verification
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleIdUpload}
                className={cn(
                  'w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors',
                  idUploaded
                    ? 'border-success bg-success/10'
                    : 'border-border hover:border-primary hover:bg-primary/5'
                )}
              >
                {idUploaded ? (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-success" />
                    <span className="text-success font-medium">ID Uploaded</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-muted-foreground" />
                    <span className="text-muted-foreground">Tap to upload</span>
                    <span className="text-xs text-muted-foreground">
                      Aadhaar, PAN, or Driving License
                    </span>
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Your ID is securely stored and only used for verification purposes
              </p>
            </div>
          </div>
        )}

        {/* Complete step */}
        {step === 'complete' && (
          <div className="animate-fade-in text-center">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Verification Complete!
            </h2>
            <p className="text-muted-foreground mb-6">
              You now have a verified seller badge. This helps build trust with buyers.
            </p>
            <div className="verified-badge text-base px-4 py-2 mx-auto inline-flex">
              <Shield className="w-5 h-5" />
              Verified Seller
            </div>
            <Button asChild className="w-full mt-8">
              <Link to="/profile">Back to Profile</Link>
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
