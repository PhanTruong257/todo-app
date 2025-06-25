// src/components/TaskList.tsx
import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
 
import { useTask } from '../contexts/TaskContext';

interface TaskListProps {
  showActions?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ showActions = true }) => {
  const { tasks, removeTask } = useTask();

  return (
    <List>
      {tasks.map(task => (
        <ListItem
          key={task.id}
          secondaryAction={
            showActions && (
              <button onClick={() => removeTask(task.id)}>Xóa</button>
            )
          }
        >
          <ListItemText primary={task.title} />
         </ListItem>
      ))}  
    </List>
  );
};

export default TaskList;