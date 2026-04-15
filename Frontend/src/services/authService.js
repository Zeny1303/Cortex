import { API_URL } from '../config';

const extractError = (data) => {
  if (!data) return "Something went wrong";

  if (typeof data.detail === "string") return data.detail;

  if (Array.isArray(data.detail)) {
    return data.detail.map(err => err.msg || err).join(", ");
  }

  if (typeof data.detail === "object") {
    return Object.values(data.detail).flat().join(", ");
  }

  return data.message || "Something went wrong";
};
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
  throw new Error(extractError(data));
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
  throw new Error(extractError(data));
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
  throw new Error(extractError(data));
  }

  // /api/auth/me returns a flat user object {id, name, email, skills, ...}
  localStorage.setItem('user', JSON.stringify(data));

  return data;
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
