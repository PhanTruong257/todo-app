import { Task } from '../types/task';
import { apiGet, apiPost, apiDelete } from './apiClient';

// Lấy danh sách tasks của user hiện tại
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    return await apiGet('/tasks');
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

// Thêm task mới
export const addTask = async (title: string): Promise<Task | null> => {
  try {
    return await apiPost('/tasks', { title });
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
};

// Xóa task
export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    return await apiDelete(`/tasks/${id}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};
