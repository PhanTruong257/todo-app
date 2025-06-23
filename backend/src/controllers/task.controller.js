const Task = require('../models/Task');

class TaskController {
    getAllTasks = async(req, res) => {
    try {
      const userId = req.user.userId;
      const tasks = await Task.find({ userId });
      res.json(tasks);
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
  }

  createTask = async(req, res) => {
    try {
      const userId = req.user.userId;
      const task = new Task({
        ...req.body,
        userId
      });
      await task.save();
      console.log('Task created:', task);
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Error creating task', error: error.message });
    }
  }

    deleteTask = async(req, res) => {
    try {
      const userId = req.user.userId;
      const taskId = req.params.id;
      
      // Make sure the task belongs to the current user
      const task = await Task.findOne({ _id: taskId, userId });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
      }
      
      await Task.findByIdAndDelete(taskId);
      res.json({ message: 'Deleted' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
  }
}

module.exports = new TaskController();
