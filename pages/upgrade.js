import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import AuthGuard from '@/components/AuthGuard';
import { useSubscription } from '@/hooks/useSubscription';
import { stripePromise } from '@/lib/stripe';

function UpgradeContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isSubscribed, isTrialActive } = useSubscription();

  if (isSubscribed || isTrialActive) {
    router.push('/dashboard');
    return null;
  }

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        showToast('Error redirecting to checkout', 'error');
      }
    } catch (error) {
      showToast('Error creating checkout session', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Your Trial Has Ended</h1>
        <p className="text-gray-600 mb-8">
          Subscribe to continue creating unlimited worship service plans
        </p>

        <div className="card max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Creative Worship Flow Pro</h2>
          <p className="text-4xl font-bold mb-6">
            $15<span className="text-lg font-normal">/month</span>
          </p>
          
          <ul className="text-left space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Unlimited service plans
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              AI-powered plan generation
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Export to PDF
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save and edit plans
            </li>
          </ul>

          <button
            onClick={handleCheckout}
            className="btn-primary w-full"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Upgrade() {
  return (
    <AuthGuard>
      <UpgradeContent />
    </AuthGuard>
  );
}
