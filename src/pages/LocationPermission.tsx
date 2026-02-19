import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/layout/Logo';

export default function LocationPermission() {
  const navigate = useNavigate();
  const { hasLocationPermission, requestDeviceLocation, detectedCity } = useApp();
  const [isDetecting, setIsDetecting] = useState(false);
  const [cityDetected, setCityDetected] = useState(false);

  const handleRequestLocation = useCallback(async () => {
    setIsDetecting(true);
    const success = await requestDeviceLocation();
    if (success) {
      setCityDetected(true);
    }
    setIsDetecting(false);
  }, [requestDeviceLocation]);

  const handleContinue = () => {
    navigate('/');
  };

  useEffect(() => {
    if (hasLocationPermission) {
      setCityDetected(true);
      return;
    }
    void handleRequestLocation();
  }, [handleRequestLocation, hasLocationPermission]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm text-center animate-fade-in">
        <Logo className="justify-center mb-6" />
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full marketplace-header flex items-center justify-center">
          <MapPin className="w-12 h-12 text-primary-foreground" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Enable Location
        </h1>
        <p className="text-muted-foreground mb-8">
          This marketplace only works within your city. We need your location to show nearby listings.
        </p>

        {/* City display */}
        {cityDetected && (
          <div className="mb-6 p-4 rounded-xl bg-success/10 border border-success/20 animate-scale-in">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Navigation className="w-5 h-5 text-success" />
              <span className="text-success font-medium">Location Detected</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{detectedCity}</p>
            <p className="text-sm text-muted-foreground mt-1">
              You'll only see listings from this city
            </p>
          </div>
        )}

        {/* Actions */}
        {!cityDetected ? (
          <Button
            onClick={handleRequestLocation}
            disabled={isDetecting}
            className="w-full h-12 text-base"
            size="lg"
          >
            {isDetecting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Detecting location...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Retry Location Access
              </span>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleContinue}
            className="w-full h-12 text-base"
            size="lg"
          >
            Continue to Marketplace
          </Button>
        )}

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground mt-6">
          Your location is only used to show relevant listings and is never shared with other users.
        </p>
      </div>
    </div>
  );
}
