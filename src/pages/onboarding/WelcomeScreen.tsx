import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldIcon, AIBrainIcon, CheckCircleIcon } from '../components/Icons/InsuranceIcons';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: AIBrainIcon,
      title: 'AI-Powered',
      description: 'Get instant decisions with our smart underwriting engine',
    },
    {
      icon: ShieldIcon,
      title: 'Simple Coverage',
      description: 'Understand exactly what you\'re protected against',
    },
    {
      icon: CheckCircleIcon,
      title: 'Fair Pricing',
      description: 'Transparent pricing based on your actual risk profile',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
  
  
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Logo */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary shadow-glow mb-4">
            <ShieldIcon className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold gradient-text mb-2">InsurAI</h1>
          <p className="text-muted-foreground">Smart Insurance for Everyone</p>
        </div>

        {/* Welcome Message */}
        <div className="max-w-md text-center mb-10 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
            Insurance Made Simple
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Get the protection you need in minutes. Our AI-powered platform makes insurance 
            accessible, understandable, and affordable.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-4 w-full max-w-md mb-10">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              variant="glass"
              className="animate-slide-in-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 rounded-xl bg-accent">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What is Insurance? */}
        <Card variant="elevated" className="w-full max-w-md mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-2">New to Insurance?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              <strong>Insurance</strong> is a way to protect yourself against unexpected events. 
              You pay a small amount regularly, and in return, the insurance company covers big 
              costs when something goes wrong.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Underwriting</strong> is how we assess your risk to give you a fair price. 
              Our AI makes this fast and transparent — you'll always know why you got your price.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Button */}
      <div className="p-6 bg-gradient-to-t from-background to-transparent">
        <Button
          variant="hero"
          size="xl"
          className="w-full animate-bounce-subtle"
          onClick={onGetStarted}
        >
          Get Started
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          No documents required to get a quote
        </p>
      </div>
    </div>
  );
};
