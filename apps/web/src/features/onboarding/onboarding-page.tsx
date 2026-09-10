import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOnboardingStatus } from '@/features/onboarding/onboarding.api';
import type { OnboardingStatus } from '@/features/onboarding/onboarding.types';
import { AddressStepSection } from '@/features/onboarding/address-step-section';
import { BusinessStepSection } from '@/features/onboarding/business-step-section';
import { PreferencesStepSection } from '@/features/onboarding/preferences-step-section';

type OnboardingStep = 1 | 2 | 3;

function resolveOnboardingStep(status: OnboardingStatus | undefined): OnboardingStep {
  if (
    !status?.organization ||
    status.organization.businessType === 'Pending' ||
    status.currentStep <= 1
  ) {
    return 1;
  }

  if (status.currentStep <= 2) {
    return 2;
  }

  return 3;
}

export function OnboardingPage(): ReactElement {
  const statusQuery = useQuery({
    queryKey: ['onboarding', 'status'],
    queryFn: fetchOnboardingStatus,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const [activeStep, setActiveStep] = useState<OnboardingStep>(1);

  useEffect(() => {
    setActiveStep(resolveOnboardingStep(statusQuery.data));
  }, [statusQuery.data]);

  if (activeStep === 1) {
    return (
      <BusinessStepSection statusQuery={statusQuery} onStepComplete={() => setActiveStep(2)} />
    );
  }

  if (activeStep === 2) {
    return <AddressStepSection statusQuery={statusQuery} onPrevious={() => setActiveStep(1)} />;
  }

  return <PreferencesStepSection statusQuery={statusQuery} onPrevious={() => setActiveStep(2)} />;
}
