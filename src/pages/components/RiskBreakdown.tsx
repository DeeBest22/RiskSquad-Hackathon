import React from 'react';
import { cn } from '@/lib/utils';
import { RiskFactor } from '@/types/insurance';
import { LocationIcon, CarIcon, UserCircleIcon, ChartIcon } from './icons/InsuranceIcons';

interface RiskBreakdownProps {
  factors: RiskFactor[];
  breakdown: {
    location: number;
    asset: number;
    behavioral: number;
    historical: number;
  };
}

const categoryConfig = {
  location: {
    label: 'Location Risk',
    icon: LocationIcon,
    description: 'Based on your area crime rate, traffic data, and flood risk',
  },
  asset: {
    label: 'Asset Risk',
    icon: CarIcon,
    description: 'Based on asset type, value, age, and condition',
  },
  behavioral: {
    label: 'Behavioral Risk',
    icon: UserCircleIcon,
    description: 'Based on response patterns and consistency',
  },
  historical: {
    label: 'Historical Risk',
    icon: ChartIcon,
    description: 'Based on past claims and insurance history',
  },
};

export const RiskBreakdown: React.FC<RiskBreakdownProps> = ({ factors, breakdown }) => {
  const getScoreColor = (score: number) => {
    if (score <= 30) return 'bg-risk-low';
    if (score <= 60) return 'bg-risk-medium';
    return 'bg-risk-high';
  };

  const getScoreTextColor = (score: number) => {
    if (score <= 30) return 'text-risk-low';
    if (score <= 60) return 'text-risk-medium';
    return 'text-risk-high';
  };

  return (
    <div className="space-y-4">
      {Object.entries(breakdown).map(([category, score]) => {
        const config = categoryConfig[category as keyof typeof categoryConfig];
        const Icon = config.icon;
        const categoryFactors = factors.filter((f) => f.category === category);

        return (
          <div
            key={category}
            className="p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <Icon className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground">{config.label}</h4>
                  <span className={cn('font-semibold font-display', getScoreTextColor(score))}>
                    {score}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{config.description}</p>
                
                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <div
                    className={cn('h-full rounded-full transition-all duration-1000 ease-out', getScoreColor(score))}
                    style={{ width: `${score}%` }}
                  />
                </div>

                {/* Individual factors */}
                {categoryFactors.length > 0 && (
                  <div className="space-y-2">
                    {categoryFactors.map((factor) => (
                      <div
                        key={factor.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              factor.impact === 'positive' && 'bg-success',
                              factor.impact === 'negative' && 'bg-danger',
                              factor.impact === 'neutral' && 'bg-muted-foreground'
                            )}
                          />
                          <span className="text-muted-foreground">{factor.name}</span>
                        </div>
                        <span
                          className={cn(
                            'font-medium',
                            factor.impact === 'positive' && 'text-success',
                            factor.impact === 'negative' && 'text-danger',
                            factor.impact === 'neutral' && 'text-muted-foreground'
                          )}
                        >
                          {factor.impact === 'positive' ? '-' : factor.impact === 'negative' ? '+' : ''}
                          {factor.score}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
