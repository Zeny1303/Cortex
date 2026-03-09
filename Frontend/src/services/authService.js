import { API_URL } from '../config';

const login = async (email, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Login failed');
  }

  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
  }

  return data;
};

const signup = async (name, email, password) => {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, skills: [] }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Signup failed');
  }

  return data;
};

const getMe = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Failed to fetch user data');
  }

  // Update local user cache for generic immediate uses
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data.user;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const authService = {
  login,
  signup,
  getMe,
  logout
};

export default authService;
