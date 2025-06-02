import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { isTrialExpired } from '@/lib/utils';

export function useSubscription() {
  const { userData } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isSubscribed: false,
    isTrialActive: true,
    daysRemaining: 0,
  });

  useEffect(() => {
    if (userData) {
      const trialExpired = isTrialExpired(userData.trial_end);
      const now = new Date();
      const trialEnd = new Date(userData.trial_end);
      const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));

      setSubscriptionStatus({
        isSubscribed: userData.is_subscribed || false,
        isTrialActive: !trialExpired,
        daysRemaining: Math.max(0, daysRemaining),
      });
    }
  }, [userData]);

  return subscriptionStatus;
}
