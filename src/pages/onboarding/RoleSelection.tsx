import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole } from '../types/insurance';
import { UserCircleIcon, BusinessIcon, ChartIcon } from '../components/Icons/InsuranceIcons';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface RoleSelectionProps {
  selectedRole?: UserRole;
  onSelect: (role: UserRole) => void;
  onBack: () => void;
  onContinue: () => void;
}

const roles = [
  {
    id: 'individual' as UserRole,
    title: 'Individual',
    description: 'I want to insure my personal belongings like my car, phone, or home',
    icon: UserCircleIcon,
    examples: ['Motor insurance', 'Gadget protection', 'Travel coverage'],
  },
  {
    id: 'business' as UserRole,
    title: 'Business Owner',
    description: 'I want to protect my small or medium business and its assets',
    icon: BusinessIcon,
    examples: ['Business property', 'Employee coverage', 'Stock protection'],
  },
  {
    id: 'admin' as UserRole,
    title: 'Insurance Partner',
    description: 'I\'m an insurance provider looking to use this platform',
    icon: ChartIcon,
    examples: ['Underwriting dashboard', 'Analytics', 'Risk management'],
  },
];

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  selectedRole,
  onSelect,
  onBack,
  onContinue,
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display font-semibold text-lg text-foreground">Choose Your Profile</h1>
          <p className="text-sm text-muted-foreground">This helps us personalize your experience</p>
        </div>
      </div>

      {/* Role Cards */}
      <div className="flex-1 px-4 py-6 space-y-4">
        {roles.map((role, index) => (
          <Card
            key={role.id}
            variant={selectedRole === role.id ? 'glass' : 'interactive'}
            className={cn(
              'cursor-pointer transition-all duration-300 animate-slide-in-up',
              selectedRole === role.id && 'ring-2 ring-primary shadow-glow'
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onSelect(role.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'p-3 rounded-xl transition-colors',
                    selectedRole === role.id ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                  )}
                >
                  <role.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{role.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {role.examples.map((example) => (
                      <span
                        key={example}
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Selection indicator */}
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                    selectedRole === role.id
                      ? 'border-primary bg-primary'
                      : 'border-border'
                  )}
                >
                  {selectedRole === role.id && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Guest mode note */}
      <div className="px-4">
        <Card variant="glass" className="mb-4">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              🎭 Want to explore first?{' '}
              <button className="text-primary font-medium hover:underline">
                Continue as Guest
              </button>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <div className="p-4 bg-gradient-to-t from-background to-transparent">
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          disabled={!selectedRole}
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
