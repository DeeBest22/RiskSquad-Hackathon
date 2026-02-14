import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldIcon, DocumentIcon, ChartIcon, CarIcon } from '../components/Icons/InsuranceIcons';
import { Plus, Bell, User, ChevronRight } from 'lucide-react';

interface UserDashboardProps {
  onNewApplication: () => void;
}

const mockPolicies = [
  {
    id: 'POL-001',
    type: 'Motor Insurance',
    icon: CarIcon,
    status: 'active',
    premium: 75000,
    coverage: 5000000,
    expiresIn: 245,
  },
];

const mockActivities = [
  {
    id: '1',
    title: 'Policy POL-001 activated',
    description: 'Your motor insurance is now active',
    time: '2 hours ago',
    type: 'success',
  },
  {
    id: '2',
    title: 'Payment received',
    description: '₦75,000 annual premium paid',
    time: '2 hours ago',
    type: 'info',
  },
  {
    id: '3',
    title: 'Application approved',
    description: 'Risk score: 32/100 (Low Risk)',
    time: '3 hours ago',
    type: 'success',
  },
];

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNewApplication }) => {
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="px-4 py-6 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm">{greeting}</p>
            <h1 className="font-display font-bold text-2xl">Welcome back!</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="glass" size="icon" className="bg-white/10 hover:bg-white/20">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="icon" className="bg-white/10 hover:bg-white/20">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 pb-6">
          <Card variant="glass" className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-display font-bold text-primary-foreground">1</p>
                  <p className="text-xs text-primary-foreground/70">Active Policies</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-primary-foreground">₦5M</p>
                  <p className="text-xs text-primary-foreground/70">Total Coverage</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-primary-foreground">0</p>
                  <p className="text-xs text-primary-foreground/70">Open Claims</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 -mt-2">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="hero"
            className="h-auto py-4 flex-col gap-2"
            onClick={onNewApplication}
          >
            <Plus className="w-6 h-6" />
            <span>New Insurance</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <DocumentIcon className="w-6 h-6" />
            <span>File a Claim</span>
          </Button>
        </div>

        {/* Active Policies */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-foreground">Your Policies</h2>
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {mockPolicies.length > 0 ? (
            <div className="space-y-3">
              {mockPolicies.map((policy) => (
                <Card key={policy.id} variant="interactive">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-accent">
                        <policy.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{policy.type}</h3>
                          <Badge variant="success">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{policy.id}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Coverage</span>
                          <span className="font-medium text-foreground">
                            ₦{policy.coverage.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-sm text-muted-foreground">
                            Expires in {policy.expiresIn} days
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="glass">
              <CardContent className="p-8 text-center">
                <ShieldIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No Active Policies</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get protected today with our AI-powered insurance
                </p>
                <Button variant="hero" onClick={onNewApplication}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-foreground">Recent Activity</h2>
          </div>

          <Card variant="elevated">
            <CardContent className="p-0">
              {mockActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`p-4 flex items-start gap-3 ${
                    index !== mockActivities.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-success' : 'bg-info'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Tip */}
        <Card variant="gradient" className="bg-gradient-to-br from-primary/5 to-accent">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ChartIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">AI Insight</h4>
              <p className="text-xs text-muted-foreground">
                Based on your profile, adding property insurance could protect your home at just
                ₦2,500/month. Want to learn more?
              </p>
              <Button variant="link" size="sm" className="px-0 mt-1 h-auto">
                Explore Options →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
