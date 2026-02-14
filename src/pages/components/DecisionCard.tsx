import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UnderwritingDecision } from '@/types/insurance';
import { CheckCircleIcon, AlertCircleIcon, XCircleIcon, UserCircleIcon } from './icons/InsuranceIcons';
import { cn } from '@/lib/utils';

interface DecisionCardProps {
  decision: UnderwritingDecision;
  premium?: number;
  explanation: string;
  keyFactors: string[];
  improvements: string[];
  conditions?: string[];
  onProceed?: () => void;
  onAppeal?: () => void;
}

const decisionConfig = {
  approved: {
    icon: CheckCircleIcon,
    title: 'Congratulations! You\'re Approved',
    subtitle: 'Your application has been approved',
    variant: 'success' as const,
    bgClass: 'from-success/10 to-success/5',
    borderClass: 'border-success/30',
    iconClass: 'text-success',
  },
  approved_with_conditions: {
    icon: AlertCircleIcon,
    title: 'Approved with Conditions',
    subtitle: 'Your application is approved with some conditions',
    variant: 'warning' as const,
    bgClass: 'from-warning/10 to-warning/5',
    borderClass: 'border-warning/30',
    iconClass: 'text-warning',
  },
  referred: {
    icon: UserCircleIcon,
    title: 'Under Review',
    subtitle: 'Your application has been referred to a human underwriter',
    variant: 'info' as const,
    bgClass: 'from-info/10 to-info/5',
    borderClass: 'border-info/30',
    iconClass: 'text-info',
  },
  declined: {
    icon: XCircleIcon,
    title: 'Application Not Approved',
    subtitle: 'We couldn\'t approve your application at this time',
    variant: 'danger' as const,
    bgClass: 'from-danger/10 to-danger/5',
    borderClass: 'border-danger/30',
    iconClass: 'text-danger',
  },
};

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  premium,
  explanation,
  keyFactors,
  improvements,
  conditions,
  onProceed,
  onAppeal,
}) => {
  const config = decisionConfig[decision];
  const Icon = config.icon;

  return (
    <Card className={cn('overflow-hidden border-2', config.borderClass)}>
      {/* Header with gradient */}
      <div className={cn('bg-gradient-to-br p-6', config.bgClass)}>
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-2xl bg-card shadow-lg')}>
            <Icon className={cn('w-8 h-8', config.iconClass)} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display font-bold text-xl text-foreground">{config.title}</h2>
              <Badge variant={config.variant}>{decision.replace('_', ' ')}</Badge>
            </div>
            <p className="text-muted-foreground">{config.subtitle}</p>
          </div>
        </div>

        {premium && decision !== 'declined' && (
          <div className="mt-6 p-4 rounded-xl bg-card shadow-md">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Your Premium</span>
              <div>
                <span className="font-display font-bold text-3xl text-foreground">
                  ₦{premium.toLocaleString()}
                </span>
                <span className="text-muted-foreground">/year</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Explanation */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">Why this decision?</h3>
          <p className="text-muted-foreground leading-relaxed">{explanation}</p>
        </div>

        {/* Key factors */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Key factors that affected your score:</h3>
          <ul className="space-y-2">
            {keyFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-muted-foreground">{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conditions (if approved with conditions) */}
        {conditions && conditions.length > 0 && (
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <h3 className="font-semibold text-warning mb-2">Conditions to meet:</h3>
            <ul className="space-y-1.5">
              {conditions.map((condition, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
                  <span className="text-muted-foreground">{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {improvements.length > 0 && (
          <div className="p-4 rounded-xl bg-accent">
            <h3 className="font-semibold text-foreground mb-2">How to improve your score:</h3>
            <ul className="space-y-1.5">
              {improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
                  <span className="text-muted-foreground">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {decision !== 'declined' && onProceed && (
            <Button variant="hero" size="lg" className="flex-1" onClick={onProceed}>
              {decision === 'referred' ? 'Track Application' : 'Proceed to Payment'}
            </Button>
          )}
          {(decision === 'declined' || decision === 'approved_with_conditions') && onAppeal && (
            <Button variant="outline" size="lg" className="flex-1" onClick={onAppeal}>
              {decision === 'declined' ? 'Request Review' : 'Ask Questions'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
