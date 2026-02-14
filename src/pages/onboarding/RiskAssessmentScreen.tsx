import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskScoreGauge } from '../components/RiskScoreGauge';
import { RiskBreakdown } from '../components/RiskBreakdown';
import { DecisionCard } from '../components/DecisionCard';
import { RiskAssessment, UnderwritingResult, UnderwritingDecision, RiskLevel, RiskFactor } from '../types/insurance';
import { AIBrainIcon } from '../components/icons/InsuranceIcons';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface RiskAssessmentScreenProps {
  onBack: () => void;
  onProceed: () => void;
}

// Simulated AI assessment
const generateMockAssessment = (): { assessment: RiskAssessment; result: UnderwritingResult } => {
  const locationScore = Math.floor(Math.random() * 40) + 20;
  const assetScore = Math.floor(Math.random() * 30) + 15;
  const behavioralScore = Math.floor(Math.random() * 20) + 10;
  const historicalScore = Math.floor(Math.random() * 25) + 10;
  
  const overallScore = Math.round((locationScore + assetScore + behavioralScore + historicalScore) / 4);
  
  const level: RiskLevel = overallScore <= 35 ? 'low' : overallScore <= 60 ? 'medium' : 'high';
  
  const factors: RiskFactor[] = [
    {
      id: 'loc-1',
      name: 'Area Crime Rate',
      category: 'location',
      score: Math.floor(Math.random() * 20) + 5,
      weight: 0.3,
      explanation: 'Based on reported incidents in your area',
      impact: locationScore < 40 ? 'positive' : 'negative',
    },
    {
      id: 'loc-2',
      name: 'Flood Risk Zone',
      category: 'location',
      score: Math.floor(Math.random() * 15) + 5,
      weight: 0.2,
      explanation: 'Historical flood data for your location',
      impact: 'neutral',
    },
    {
      id: 'asset-1',
      name: 'Asset Condition',
      category: 'asset',
      score: Math.floor(Math.random() * 20) + 10,
      weight: 0.25,
      explanation: 'Based on age and maintenance indicators',
      impact: assetScore < 25 ? 'positive' : 'negative',
    },
    {
      id: 'asset-2',
      name: 'Market Value',
      category: 'asset',
      score: Math.floor(Math.random() * 15) + 5,
      weight: 0.15,
      explanation: 'Current market valuation of the asset',
      impact: 'neutral',
    },
    {
      id: 'behav-1',
      name: 'Response Consistency',
      category: 'behavioral',
      score: Math.floor(Math.random() * 10) + 5,
      weight: 0.1,
      explanation: 'How consistent your answers were',
      impact: 'positive',
    },
    {
      id: 'hist-1',
      name: 'Claims History',
      category: 'historical',
      score: Math.floor(Math.random() * 15) + 5,
      weight: 0.2,
      explanation: 'Based on previous insurance claims',
      impact: historicalScore < 20 ? 'positive' : 'negative',
    },
  ];

  const assessment: RiskAssessment = {
    overallScore,
    level,
    factors,
    breakdown: {
      location: locationScore,
      asset: assetScore,
      behavioral: behavioralScore,
      historical: historicalScore,
    },
  };

  let decision: UnderwritingDecision;
  let conditions: string[] | undefined;
  
  if (overallScore <= 30) {
    decision = 'approved';
  } else if (overallScore <= 50) {
    decision = 'approved_with_conditions';
    conditions = [
      'Install a security system within 30 days',
      'Provide proof of regular maintenance',
    ];
  } else if (overallScore <= 70) {
    decision = 'referred';
  } else {
    decision = 'declined';
  }

  const basePremium = 50000;
  const premium = Math.round(basePremium * (1 + overallScore / 100));

  const result: UnderwritingResult = {
    id: `UW-${Date.now()}`,
    decision,
    riskAssessment: assessment,
    premium,
    explanation: getExplanation(decision, assessment),
    keyFactors: [
      `Your location has a ${locationScore < 40 ? 'relatively low' : 'moderate to high'} risk profile`,
      `Asset condition contributes ${assetScore}% to your overall score`,
      `Your response pattern shows ${behavioralScore < 15 ? 'consistent and trustworthy' : 'some variations that require review'}`,
    ],
    improvements: [
      'Adding security features can lower your premium by up to 15%',
      'Providing additional documentation may improve your score',
      'Building a claims-free history will help future applications',
    ],
    conditions,
    createdAt: new Date(),
  };

  return { assessment, result };
};

const getExplanation = (decision: UnderwritingDecision, assessment: RiskAssessment): string => {
  switch (decision) {
    case 'approved':
      return `Great news! Based on our AI analysis, your risk profile is favorable. Your overall score of ${assessment.overallScore} indicates low risk across location, asset condition, and behavioral factors.`;
    case 'approved_with_conditions':
      return `Your application is approved, but we've identified some areas that need attention. Meeting the conditions below will ensure your coverage remains active and may qualify you for better rates in the future.`;
    case 'referred':
      return `Your application requires additional review by our team. This is common when we need more information to make a fair assessment. A human underwriter will review your case within 24-48 hours.`;
    case 'declined':
      return `We're unable to offer coverage at this time based on the current risk assessment. This decision is primarily influenced by factors in your location and historical data. Please review the improvement suggestions below.`;
  }
};

export const RiskAssessmentScreen: React.FC<RiskAssessmentScreenProps> = ({
  onBack,
  onProceed,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<UnderwritingResult | null>(null);

  const analysisSteps = [
    'Analyzing location data...',
    'Assessing asset information...',
    'Evaluating risk factors...',
    'Calculating premium...',
    'Generating decision...',
  ];

  useEffect(() => {
    if (isAnalyzing) {
      const stepInterval = setInterval(() => {
        setAnalysisStep((prev) => {
          if (prev >= analysisSteps.length - 1) {
            clearInterval(stepInterval);
            setTimeout(() => {
              const { result } = generateMockAssessment();
              setResult(result);
              setIsAnalyzing(false);
            }, 500);
            return prev;
          }
          return prev + 1;
        });
      }, 800);

      return () => clearInterval(stepInterval);
    }
  }, [isAnalyzing]);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mb-8 relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-primary flex items-center justify-center mx-auto pulse-glow">
              <AIBrainIcon className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute -inset-4 rounded-full border-2 border-primary/30 animate-pulse-ring" />
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            AI Analysis in Progress
          </h2>
          <p className="text-muted-foreground mb-8">
            Our AI is evaluating your risk profile using multiple data sources
          </p>

          <div className="space-y-3">
            {analysisSteps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  index < analysisStep
                    ? 'bg-success/10 text-success'
                    : index === analysisStep
                    ? 'bg-accent text-foreground'
                    : 'bg-muted/50 text-muted-foreground'
                }`}
              >
                {index < analysisStep ? (
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : index === analysisStep ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-muted" />
                )}
                <span className="text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display font-semibold text-lg text-foreground">Your Assessment</h1>
          <p className="text-sm text-muted-foreground">AI-powered risk analysis complete</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6 overflow-auto space-y-6">
        {/* Risk Score */}
        <Card variant="glass" className="animate-scale-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AIBrainIcon className="w-5 h-5 text-primary" />
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <RiskScoreGauge
              score={result.riskAssessment.overallScore}
              level={result.riskAssessment.level}
              size="lg"
            />
          </CardContent>
        </Card>

        {/* Decision Card */}
        <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <DecisionCard
            decision={result.decision}
            premium={result.premium}
            explanation={result.explanation}
            keyFactors={result.keyFactors}
            improvements={result.improvements}
            conditions={result.conditions}
            onProceed={onProceed}
            onAppeal={() => {}}
          />
        </div>

        {/* Risk Breakdown */}
        <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-lg">Risk Factor Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskBreakdown
              factors={result.riskAssessment.factors}
              breakdown={result.riskAssessment.breakdown}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
