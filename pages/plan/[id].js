import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import AuthGuard from '@/components/AuthGuard';
import TrialGuard from '@/components/TrialGuard';
import PlanViewer from '@/components/PlanViewer';
import LoadingSpinner from '@/components/LoadingSpinner';

function PlanContent() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { showToast } = useToast();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState('');

  useEffect(() => {
    if (id) {
      fetchPlan();
    }
  }, [id]);

  const fetchPlan = async () => {
    try {
      const planDoc = await getDoc(doc(db, 'service_plans', id));
      if (planDoc.exists() && planDoc.data().userId === user.uid) {
        setPlan({ id: planDoc.id, ...planDoc.data() });
        setEditedPlan(planDoc.data().service_plan);
      } else {
        showToast('Plan not found', 'error');
        router.push('/dashboard');
      }
    } catch (error) {
      showToast('Error fetching plan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'service_plans', id), {
        service_plan: editedPlan,
      });
      setPlan({ ...plan, service_plan: editedPlan });
      setEditing(false);
      showToast('Plan updated successfully', 'success');
    } catch (error) {
      showToast('Error updating plan', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!plan) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Service Plan: {plan.theme}</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>

      {editing ? (
        <div className="space-y-4">
          <textarea
            value={editedPlan}
            onChange={(e) => setEditedPlan(e.target.value)}
            className="input-field h-96"
          />
          <div className="flex space-x-2">
            <button onClick={handleSave} className="btn-primary">
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditedPlan(plan.service_plan);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary"
            >
              Edit Plan
            </button>
          </div>
          <PlanViewer plan={plan} />
        </div>
      )}
    </div>
  );
}

export default function Plan() {
  return (
    <AuthGuard>
      <TrialGuard>
        <PlanContent />
      </TrialGuard>
    </AuthGuard>
  );
}
