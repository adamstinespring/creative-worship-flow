import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function OnboardingForm({ initialData = {}, onComplete }) {
  const { user, setUserData } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    worship_style: initialData.worship_style || '',
    favorite_songs: initialData.favorite_songs || '',
    service_structure: initialData.service_structure || '',
    worship_philosophy: initialData.worship_philosophy || '',
    congregation_notes: initialData.congregation_notes || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), formData);
      setUserData((prev) => ({ ...prev, ...formData }));
      showToast('Preferences saved successfully!', 'success');
      if (onComplete) onComplete();
    } catch (error) {
      showToast('Error saving preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Worship Style
        </label>
        <input
          type="text"
          required
          value={formData.worship_style}
          onChange={(e) => setFormData({ ...formData, worship_style: e.target.value })}
          className="input-field"
          placeholder="e.g., Contemporary, Traditional, Blended"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Favorite Songs
        </label>
        <textarea
          required
          rows={4}
          value={formData.favorite_songs}
          onChange={(e) => setFormData({ ...formData, favorite_songs: e.target.value })}
          className="input-field"
          placeholder="Enter each song on a new line"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Structure
        </label>
        <textarea
          required
          rows={4}
          value={formData.service_structure}
          onChange={(e) => setFormData({ ...formData, service_structure: e.target.value })}
          className="input-field"
          placeholder="Describe your typical service flow"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Worship Philosophy (Optional)
        </label>
        <textarea
          rows={3}
          value={formData.worship_philosophy}
          onChange={(e) => setFormData({ ...formData, worship_philosophy: e.target.value })}
          className="input-field"
          placeholder="Your approach to worship"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Congregation Notes (Optional)
        </label>
        <textarea
          rows={3}
          value={formData.congregation_notes}
          onChange={(e) => setFormData({ ...formData, congregation_notes: e.target.value })}
          className="input-field"
          placeholder="Any specific notes about your congregation"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  );
}
