// src/contexts/TaskContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types/task';
import { fetchTasks, addTask, deleteTask } from '../services/task';
import { useAuth } from '../hooks/useAuth';

interface TaskContextType {
  tasks: Task[];
  addNewTask: (title: string) => void;
  removeTask: (id: string) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks().then(setTasks);
    } else {
      setTasks([]);
    }
  }, [user]);

  const addNewTask = (title: string) => {
    if (!user) {
      setTasks(prev => [...prev, { id: Date.now().toString(), title }]);
    } else {
      addTask(title).then(newTask => {
        if (newTask) {
          setTasks(prev => [...prev, newTask]);
        }
      });
    }
  };

  const removeTask = (id: string) => {
    if (!user) {
      setTasks(prev => prev.filter(task => task.id !== id));
    } else {
      deleteTask(id).then(success => {
        if (success) {
          setTasks(prev => prev.filter(task => task.id !== id));
        }
      });
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addNewTask,
      removeTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};