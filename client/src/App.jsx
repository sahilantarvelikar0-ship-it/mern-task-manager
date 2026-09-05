import { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './components/Auth';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const authConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:3000/tasks', authConfig);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await axios.post('http://localhost:3000/tasks', { title: newTaskTitle }, authConfig);
      setNewTaskTitle('');
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding task');
    }
  };

  const handleToggleTask = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:3000/tasks/${id}`, { completed: !currentStatus }, authConfig);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`, authConfig);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setTasks([]);
  };

  if (!token) {
    return <Auth setToken={setToken} />;
  }

  return (
    <div className="app-container">
      <div className="header">
        <h2>My Tasks</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Enter new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="task-input"
          required
        />
        <button type="submit" className="add-btn">Add</button>
      </form>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center' }}>No tasks found. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <li key={task._id} className="task-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task._id, task.completed)}
                  style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                />
                <span style={{ 
                  textDecoration: task.completed ? 'line-through' : 'none', 
                  color: task.completed ? '#64748b' : '#f8fafc' 
                }}>
                  {task.title}
                </span>
              </div>
              <button onClick={() => handleDeleteTask(task._id)} className="delete-btn">
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;