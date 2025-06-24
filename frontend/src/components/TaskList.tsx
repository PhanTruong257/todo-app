// src/components/TaskList.tsx
import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
              <IconButton edge="end" onClick={() => removeTask(task.id)}>
                <DeleteIcon />  
              </IconButton>
            )
          }
        >
          <ListItemText primary={task.title} /> 
          <ListItemText primary={task.id + "  1"} />
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;