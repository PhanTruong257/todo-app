import { refreshToken } from './auth';

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

// Biến để theo dõi xem hiện tại có đang refreshing token hay không
let isRefreshing = false;
// Hàng đợi các requests cần thực hiện lại sau khi refresh token
let failedQueue: any[] = [];

// Xử lý các requests trong hàng đợi
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// API client với xử lý refresh token
export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Thêm headers xác thực nếu không được cung cấp
  if (!options.headers) {
    options.headers = getAuthHeader();
  }
  
  try {
    const response = await fetch(url, options);
    
    // Nếu API trả về lỗi Unauthorized (401)
    if (response.status === 401) {
      // Nếu đang ở endpoint refresh-token thì có nghĩa là refresh token cũng không hợp lệ
      if (endpoint === '/auth/refresh-token') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.reload(); // Redirect về trang login
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
      
      // Tạo một promise để đưa vào hàng đợi
      const retryOriginalRequest = new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
      
      // Nếu chưa đang refresh token, thực hiện refresh
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const refreshResult = await refreshToken();
          processQueue(null, refreshResult.accessToken);
        } catch (error) {
          processQueue(error, null);
          // Redirect về trang login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.reload();
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }
      
      // Chờ kết quả từ refresh token và thử lại request ban đầu
      return retryOriginalRequest.then(() => {
        options.headers = getAuthHeader();
        return fetch(url, options);
      });
    }
    
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

// GET request với xử lý refresh token
export const apiGet = async (endpoint: string) => {
  const response = await apiClient(endpoint);
  return response.json();
};

// POST request với xử lý refresh token
export const apiPost = async (endpoint: string, data: any) => {
  const response = await apiClient(endpoint, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(data)
  });
  return response.json();
};

// DELETE request với xử lý refresh token
export const apiDelete = async (endpoint: string) => {
  const response = await apiClient(endpoint, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return response.status === 204 ? true : response.json();
};
