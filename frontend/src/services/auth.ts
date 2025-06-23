export interface AuthResponse {
  status: string;
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  message?: string;
}

// URL cơ sở của API backend
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function để lấy token từ localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const register = async (username: string, password: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  
  if (data.status === 'success') {
    if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
  }
  
  return data;
};

export const updateUserHobbies = async (hobbies: string[], replace = false): Promise<any> => {
  try {
    const data = { hobbies, replace };
    const res = await fetch(`${API_BASE_URL}/auth/update-hobbies`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    });
    return res.json();
  } catch (error) {
    console.error('Error updating hobbies:', error);
    return { status: 'error', message: 'Failed to update hobbies' };
  }
};

export const updateUserGender = async (gender: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/update-gender`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ gender })
    });
    return res.json();
  } catch (error) {
    console.error('Error updating gender:', error);
    return { status: 'error', message: 'Failed to update gender' };
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return res.json();
  } catch (error) {
    console.error('Error changing password:', error);
    return { status: 'error', message: 'Failed to change password' };
  }
};

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await res.json();
  
  if (data.status === 'success' && data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    return { accessToken: data.accessToken };
  } else {
    throw new Error(data.message || 'Failed to refresh token');
  }
};
