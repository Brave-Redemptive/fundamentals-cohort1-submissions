import {useEffect, useState} from 'react';
import axios from 'axios';
import TaskItem from '../components/TaskItem.jsx';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get('/api/tasks');
        setTasks(res.data.data);
      } catch (e) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h3>All Tasks</h3>

      {tasks.length === 0 && <p>No tasks available</p>}

      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
