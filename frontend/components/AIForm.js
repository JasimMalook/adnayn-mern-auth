import { useState } from 'react';
import { createApiClient } from '../utils/api';

const AIForm = ({ token, onGenerated }) => {
  const [type, setType] = useState('idea');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const api = createApiClient(token);
      const res = await api.post('/api/ai/generate', { type, topic, audience, tone });
      onGenerated(res.data.content, { type, topic });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded p-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setType('idea')}
          className={`px-3 py-1 text-xs rounded border ${
            type === 'idea' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'
          }`}
        >
          Post Ideas
        </button>
        <button
          type="button"
          onClick={() => setType('caption')}
          className={`px-3 py-1 text-xs rounded border ${
            type === 'caption' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'
          }`}
        >
          Captions
        </button>
        <button
          type="button"
          onClick={() => setType('product_description')}
          className={`px-3 py-1 text-xs rounded border ${
            type === 'product_description'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700'
          }`}
        >
          Product Descriptions
        </button>
        <button
          type="button"
          onClick={() => setType('content_plan')}
          className={`px-3 py-1 text-xs rounded border ${
            type === 'content_plan' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'
          }`}
        >
          30-day Plan
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Topic</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="e.g. Instagram marketing for local cafes"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Audience</label>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="e.g. small business owners"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tone</label>
          <input
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="e.g. friendly, expert, playful"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Content'}
      </button>
    </form>
  );
};

export default AIForm;
