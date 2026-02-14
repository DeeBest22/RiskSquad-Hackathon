import { useState, useCallback } from 'react';
import { UserRole, InsuranceType } from '@/types/insurance';

export interface OnboardingData {
  // Role selection
  role?: UserRole;
  
  // Account info
  fullName: string;
  phoneNumber: string;
  email: string;
  
  // Location
  location: {
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  
  // Optional documents
  nationalId?: string;
  driversLicense?: string;
  vehiclePlate?: string;
  
  // Product selection
  selectedProduct?: InsuranceType;
  
  // Asset details (varies by product)
  assetDetails: Record<string, any>;
}

const initialData: OnboardingData = {
  fullName: '',
  phoneNumber: '',
  email: '',
  location: { address: '' },
  assetDetails: {},
};

export const useOnboarding = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((targetStep: number) => {
    setStep(targetStep);
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setData(initialData);
  }, []);

  return {
    step,
    data,
    isLoading,
    setIsLoading,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    reset,
  };
};
