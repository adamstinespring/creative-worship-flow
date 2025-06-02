import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';

export default function TrialGuard({ children }) {
  const { isSubscribed, isTrialActive } = useSubscription();
  const { userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userData && !isSubscribed && !isTrialActive) {
      router.push('/upgrade');
    }
  }, [isSubscribed, isTrialActive, userData, router]);

  return children;
}
