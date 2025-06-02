import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useSubscription } from '../hooks/useSubscription';
import AuthGuard from '../components/AuthGuard';
import TrialGuard from '../components/TrialGuard';
import OnboardingForm from '../components/OnboardingForm';
import ServicePlanCard from '../components/ServicePlanCard';
import LoadingSpinner from '../components/LoadingSpinner';

function DashboardContent() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const { showToast } = useToast();
  const { isTrialActive, daysRemaining } = useSubscription();
  const [theme, setTheme] = useState('');
  const [generating, setGenerating] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (userData && !userData.worship_style) {
      setShowOnboarding(true);
    }
  }, [userData]);

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'service_plans'),
        where('userId', '==', user.uid),
      );
      const snapshot = await getDocs(q);
      const plansData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlans(plansData);
    } catch (error) {
      showToast('Error fetching plans', 'error');
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!userData?.worship_style) {
      showToast('Please complete your preferences first', 'error');
      setShowOnboarding(true);
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          userData,
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Service plan generated successfully!', 'success');
        router.push(`/plan/${data.planId}`);
      } else {
        showToast(data.error || 'Error generating plan', 'error');
      }
    } catch (error) {
      showToast('Error generating plan', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        await deleteDoc(doc(db, 'service_plans', planId));
        setPlans(plans.filter(p => p.id !== planId));
        showToast('Plan deleted successfully', 'success');
      } catch (error) {
        showToast('Error deleting plan', 'error');
      }
    }
  };

  if (showOnboarding) {
    return (
      <div className="max-w-2xl mx-auto mt-8 px-4">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Welcome! Let's set up your preferences</h2>
          <OnboardingForm onComplete={() => setShowOnboarding(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isTrialActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            You have {daysRemaining} days remaining in your free trial.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Generate New Service Plan</h2>
            <form onSubmit={handleGeneratePlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Theme
                </label>
                <input
                  type="text"
                  required
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Grace and Forgiveness, Hope in Trials"
                />
              </div>
              <button
                type="submit"
                disabled={generating}
                className="btn-primary w-full"
              >
                {generating ? 'Generating...' : 'Generate Plan'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Your Service Plans</h2>
            {loadingPlans ? (
              <LoadingSpinner />
            ) : plans.length === 0 ? (
              <p className="text-gray-600">No service plans yet. Create your first one!</p>
            ) : (
              <div className="grid gap-4">
                {plans.map((plan) => (
                  <ServicePlanCard
                    key={plan.id}
                    plan={plan}
                    onDelete={handleDeletePlan}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Your Preferences</h3>
            <button
              onClick={() => setShowOnboarding(true)}
              className="btn-secondary w-full"
            >
              Edit Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <TrialGuard>
        <DashboardContent />
      </TrialGuard>
    </AuthGuard>
  );
}
