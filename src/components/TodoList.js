import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('none');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  // Check screen size and update state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;

    const newTaskObj = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'asc') return a.text.localeCompare(b.text);
    if (sort === 'desc') return b.text.localeCompare(a.text);
    return 0;
  });

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>
      
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          value={newTask}
          onChange={handleInputChange}
          placeholder="Add a new task..."
          className="task-input"
          aria-label="New task input"
        />
        <button 
          type="submit" 
          className="add-button"
          aria-label="Add task"
        >
          {isMobile ? '+' : 'Add Task'}
        </button>
      </form>

      <div className="controls">
        <div className="filter-controls">
          <span>Filter: </span>
          <button 
            onClick={() => setFilter('all')} 
            className={filter === 'all' ? 'active' : ''}
            aria-label="Show all tasks"
          >
            {isMobile ? 'All' : 'All Tasks'}
          </button>
          <button 
            onClick={() => setFilter('active')} 
            className={filter === 'active' ? 'active' : ''}
            aria-label="Show active tasks"
          >
            {isMobile ? 'Active' : 'Active Tasks'}
          </button>
          <button 
            onClick={() => setFilter('completed')} 
            className={filter === 'completed' ? 'active' : ''}
            aria-label="Show completed tasks"
          >
            {isMobile ? 'Done' : 'Completed Tasks'}
          </button>
        </div>

        <div className="sort-controls">
          <span>Sort: </span>
          <button 
            onClick={() => setSort('none')} 
            className={sort === 'none' ? 'active' : ''}
            aria-label="No sorting"
          >
            {isMobile ? 'None' : 'Default'}
          </button>
          <button 
            onClick={() => setSort('asc')} 
            className={sort === 'asc' ? 'active' : ''}
            aria-label="Sort A to Z"
          >
            {isMobile ? 'A-Z' : 'A to Z'}
          </button>
          <button 
            onClick={() => setSort('desc')} 
            className={sort === 'desc' ? 'active' : ''}
            aria-label="Sort Z to A"
          >
            {isMobile ? 'Z-A' : 'Z to A'}
          </button>
        </div>
      </div>

      {sortedTasks.length > 0 && (
        <ul className="task-list">
          {sortedTasks.map(task => (
            <li 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''}`}
              aria-label={`Task: ${task.text}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
                className="task-checkbox"
                aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
              />
              <span className="task-text">{task.text}</span>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="delete-button"
                aria-label="Delete task"
              >
                {isMobile ? '✕' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {sortedTasks.length === 0 && (
        <div className="no-tasks">
          {filter === 'all' 
            ? 'No tasks yet. Add one above!'
            : filter === 'active' 
              ? 'No active tasks!'
              : 'No completed tasks!'}
        </div>
      )}

      <div className="stats">
        <span>Total: {totalTasks}</span>
        <span>Active: {activeTasks}</span>
        <span>Completed: {completedTasks}</span>
        {completedTasks > 0 && (
          <button 
            onClick={handleClearCompleted}
            className="delete-button"
            style={{ marginLeft: 'auto' }}
            aria-label="Clear completed tasks"
          >
            {isMobile ? 'Clear Done' : 'Clear Completed'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoList;