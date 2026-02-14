import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { OnboardingData } from '@/hooks/useOnboarding';
import { ArrowLeft, Phone, Mail, User, MapPin } from 'lucide-react';

interface AccountSetupProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const AccountSetup: React.FC<AccountSetupProps> = ({
  data,
  onUpdate,
  onBack,
  onContinue,
}) => {
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  const isValid = data.fullName.length > 2 && data.phoneNumber.length >= 10;

  const handleSendOtp = () => {
    if (data.phoneNumber.length >= 10) {
      setPhoneOtpSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display font-semibold text-lg text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground">Just a few details to get started</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Full Name */}
        <div className="space-y-2 animate-slide-in-up">
          <Label htmlFor="fullName" className="text-foreground font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={data.fullName}
              onChange={(e) => onUpdate({ fullName: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <Label htmlFor="phone" className="text-foreground font-medium">
            Phone Number
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="080XXXXXXXX"
                value={data.phoneNumber}
                onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
                className="pl-10"
              />
            </div>
            <Button
              variant={phoneOtpSent ? 'success' : 'outline'}
              onClick={handleSendOtp}
              disabled={data.phoneNumber.length < 10}
            >
              {phoneOtpSent ? 'Sent ✓' : 'Send OTP'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">We'll send you a verification code</p>
        </div>

        {/* Email (Optional) */}
        <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <Label htmlFor="email" className="text-foreground font-medium">
            Email Address <span className="text-muted-foreground">(optional)</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => onUpdate({ email: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <Label htmlFor="location" className="text-foreground font-medium">
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="location"
              placeholder="Enter your city or area"
              value={data.location.address}
              onChange={(e) => onUpdate({ location: { address: e.target.value } })}
              className="pl-10"
            />
          </div>
          <Button variant="subtle" size="sm" className="w-full">
            <MapPin className="w-4 h-4 mr-2" />
            Use Current Location
          </Button>
        </div>

        {/* Optional Documents */}
        <Card variant="glass" className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-2">Optional Documents</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adding these can help you get better rates, but they're not required.
            </p>
            <div className="space-y-3">
              <Input
                placeholder="National ID Number (optional)"
                value={data.nationalId || ''}
                onChange={(e) => onUpdate({ nationalId: e.target.value })}
              />
              <Input
                placeholder="Driver's License (optional)"
                value={data.driversLicense || ''}
                onChange={(e) => onUpdate({ driversLicense: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <div className="p-4 bg-gradient-to-t from-background to-transparent">
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          disabled={!isValid}
          onClick={onContinue}
        >
          Continue
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Your information is encrypted and secure
        </p>
      </div>
    </div>
  );
};
