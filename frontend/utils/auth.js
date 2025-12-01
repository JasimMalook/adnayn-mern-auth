export const getStoredAuth = () => {
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) return null;
    return { token, user: JSON.parse(user) };
  } catch (e) {
    return null;
  }
};

export const saveAuth = ({ token, user }) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
