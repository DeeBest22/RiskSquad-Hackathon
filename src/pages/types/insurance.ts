export type UserRole = 'individual' | 'business' | 'admin';

export type InsuranceType = 'motor' | 'property' | 'sme' | 'gadget' | 'travel' | 'micro';

export type RiskLevel = 'low' | 'medium' | 'high';

export type UnderwritingDecision = 'approved' | 'approved_with_conditions' | 'referred' | 'declined';

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  location: {
    coordinates?: { lat: number; lng: number };
    address: string;
  };
  nationalId?: string;
  driversLicense?: string;
  vehiclePlate?: string;
  role: UserRole;
  createdAt: Date;
}

export interface InsuranceProduct {
  id: InsuranceType;
  name: string;
  description: string;
  icon: string;
  coverageExamples: string[];
  priceFactors: string[];
  approvalFactors: string[];
  minPremium: number;
  maxPremium: number;
}

export interface RiskFactor {
  id: string;
  name: string;
  category: 'location' | 'asset' | 'behavioral' | 'historical';
  score: number;
  weight: number;
  explanation: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface RiskAssessment {
  overallScore: number;
  level: RiskLevel;
  factors: RiskFactor[];
  breakdown: {
    location: number;
    asset: number;
    behavioral: number;
    historical: number;
  };
}

export interface UnderwritingResult {
  id: string;
  decision: UnderwritingDecision;
  riskAssessment: RiskAssessment;
  premium: number;
  explanation: string;
  keyFactors: string[];
  improvements: string[];
  conditions?: string[];
  createdAt: Date;
}

export interface Policy {
  id: string;
  userId: string;
  productType: InsuranceType;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  premium: number;
  coverage: number;
  startDate: Date;
  endDate: Date;
  underwritingResult: UnderwritingResult;
}

export interface Claim {
  id: string;
  policyId: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  description: string;
  amount: number;
  images: string[];
  fraudRisk: number;
  submittedAt: Date;
}

export interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}
