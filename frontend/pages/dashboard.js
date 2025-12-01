import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AIForm from '../components/AIForm';
import PostsList from '../components/PostsList';
import { createApiClient } from '../utils/api';

export default function Dashboard({ auth }) {
  const [generated, setGenerated] = useState('');
  const [generatedMeta, setGeneratedMeta] = useState(null);
  const [saving, setSaving] = useState(false);
  const [posts, setPosts] = useState([]);
  const [usage, setUsage] = useState(null);

  const token = auth?.token;

  const loadPosts = async () => {
    try {
      const api = createApiClient(token);
      const res = await api.get('/api/ai/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsage = async () => {
    try {
      const api = createApiClient(token);
      const res = await api.get('/api/auth/usage');
      setUsage(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      loadPosts();
      loadUsage();
    }
  }, [token]);

  const handleGenerated = (content, meta) => {
    setGenerated(content);
    setGeneratedMeta(meta);
  };

  const handleSave = async () => {
    if (!generated) return;
    setSaving(true);
    try {
      const api = createApiClient(token);
      await api.post('/api/ai/posts', {
        type: generatedMeta?.type || 'idea',
        title: generatedMeta?.topic || 'Generated Content',
        content: generated,
      });
      await loadPosts();
      await loadUsage();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const statsTotalPosts = posts.length;

  return (
    <ProtectedRoute auth={auth}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[180px] bg-white shadow rounded p-4 text-sm">
            <p className="text-xs text-gray-500">Plan</p>
            <p className="text-lg font-semibold">{auth?.user?.role}</p>
          </div>
          <div className="flex-1 min-w-[180px] bg-white shadow rounded p-4 text-sm">
            <p className="text-xs text-gray-500">Total Posts Saved</p>
            <p className="text-lg font-semibold">{statsTotalPosts}</p>
          </div>
          <div className="flex-1 min-w-[180px] bg-white shadow rounded p-4 text-sm">
            <p className="text-xs text-gray-500">AI Requests this month</p>
            <p className="text-lg font-semibold">{usage?.aiRequestsThisMonth ?? '-'}</p>
          </div>
        </div>

        <AIForm token={token} onGenerated={handleGenerated} />

        {generated && (
          <div className="bg-white shadow rounded p-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Generated Content</h2>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => navigator.clipboard.writeText(generated)}
                  className="px-2 py-1 border rounded hover:bg-gray-50"
                >
                  Copy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-sm max-h-72 overflow-auto">{generated}</pre>
          </div>
        )}

        <PostsList token={token} posts={posts} refresh={loadPosts} />
      </div>
    </ProtectedRoute>
  );
}
