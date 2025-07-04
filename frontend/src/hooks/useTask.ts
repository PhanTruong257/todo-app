// src/hooks/useTask.ts
import { useContext } from 'react';
import { TaskContext } from '../contexts/TaskContext';

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};