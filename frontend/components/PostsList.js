import { createApiClient } from '../utils/api';

const PostsList = ({ token, posts, refresh }) => {
  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      const api = createApiClient(token);
      await api.delete(`/api/ai/posts/${id}`);
      refresh();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 mt-6">
      <h2 className="text-lg font-semibold mb-3">Saved Content</h2>
      {posts.length === 0 && <p className="text-sm text-gray-500">No posts saved yet.</p>}
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post._id} className="border rounded p-3 text-sm flex justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-gray-500">{post.type}</p>
              {post.title && <p className="font-medium">{post.title}</p>}
              <pre className="whitespace-pre-wrap text-xs mt-1 max-h-40 overflow-auto">{post.content}</pre>
            </div>
            <div className="flex flex-col items-end gap-2 text-xs">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(post.content);
                }}
                className="px-2 py-1 border rounded hover:bg-gray-50"
              >
                Copy
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="px-2 py-1 border rounded text-red-500 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
