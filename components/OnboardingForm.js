import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function OnboardingForm({ initialData = {}, onComplete }) {
  const { user, setUserData } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [formData, setFormData] = useState({
    worship_style: initialData.worship_style || '',
    favorite_songs: initialData.favorite_songs || '',
    service_structure: initialData.service_structure || '',
    worship_philosophy: initialData.worship_philosophy || '',
    congregation_notes: initialData.congregation_notes || '',
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      showToast('Please upload a CSV file', 'error');
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const songs = [];
      
      // Skip header row and parse songs
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          // Planning Center CSV usually has song title in first column
          const columns = line.split(',');
          const songTitle = columns[0].replace(/"/g, '').trim();
          if (songTitle) {
            songs.push(songTitle);
          }
        }
      }

      if (songs.length > 0) {
        setFormData({ ...formData, favorite_songs: songs.join('\n') });
        showToast(`Imported ${songs.length} songs successfully!`, 'success');
      } else {
        showToast('No songs found in the CSV file', 'error');
      }
    } catch (error) {
      showToast('Error reading CSV file', 'error');
    }
  };

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
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          Song Library
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </label>

        {showHelp && (
          <div className="mb-2 p-3 bg-blue-50 rounded-md text-sm">
            <p className="font-semibold mb-2">How to export from Planning Center:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to Services → Songs</li>
              <li>Click "..." menu → Export</li>
              <li>Choose "CSV" format</li>
              <li>Select "Song Title" column</li>
              <li>Click Export and save the file</li>
            </ol>
          </div>
        )}

        <div className="mb-2">
          <label className="block">
            <span className="btn-secondary cursor-pointer inline-block">
              Upload Planning Center CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">Or manually enter songs below</p>
        </div>

        <textarea
          required
          rows={4}
          value={formData.favorite_songs}
          onChange={(e) => setFormData({ ...formData, favorite_songs: e.target.value })}
          className="input-field"
          placeholder="Enter each song on a new line or upload CSV from Planning Center"
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