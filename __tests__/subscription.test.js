import { renderHook } from '@testing-library/react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth');

describe('Subscription Management', () => {
  test('should calculate trial days remaining', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    useAuth.mockReturnValue({
      userData: {
        trial_end: futureDate.toISOString(),
        is_subscribed: false,
      },
    });

    const { result } = renderHook(() => useSubscription());

    expect(result.current.isTrialActive).toBe(true);
    expect(result.current.daysRemaining).toBe(5);
    expect(result.current.isSubscribed).toBe(false);
  });

  test('should handle expired trial', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    useAuth.mockReturnValue({
      userData: {
        trial_end: pastDate.toISOString(),
        is_subscribed: false,
      },
    });

    const { result } = renderHook(() => useSubscription());

    expect(result.current.isTrialActive).toBe(false);
    expect(result.current.daysRemaining).toBe(0);
  });

  test('should handle active subscription', () => {
    useAuth.mockReturnValue({
      userData: {
        trial_end: new Date().toISOString(),
        is_subscribed: true,
      },
    });

    const { result } = renderHook(() => useSubscription());

    expect(result.current.isSubscribed).toBe(true);
  });
});
