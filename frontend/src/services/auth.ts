export interface AuthResponse {
  status: string;
  accessToken?: string;
  refreshToken?: string;
  email?: string;
  message?: string;
}

// URL cơ sở của API backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Helper function để lấy token từ localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const register = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if (data.status === 'success') {
    if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
  }

  return data;
};

export const googleLogin = async (credential: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });

    const data = await res.json();

    if (data.status === 'success') {
      // Lưu token vào localStorage
      if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    }

    return data;
  } catch (error) {
    console.error('Google login error:', error);
    return { status: 'error', message: 'Network error' };
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

export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Server error:', errorData);
      return {
        status: 'error',
        message: errorData.message || `Lỗi máy chủ: ${res.status}`
      };
    }

    return res.json();
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      status: 'error',
      message: `Lỗi kết nối: ${error instanceof Error ? error.message : 'Network error'}`
    };
  }
};

export const verifyResetToken = async (token: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/verify-reset-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    return res.json();
  } catch (error) {
    console.error('Verify token error:', error);
    return { status: 'error', message: 'Network error' };
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    return res.json();
  } catch (error) {
    console.error('Reset password error:', error);
    return { status: 'error', message: 'Network error' };
  }
};
