import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function CreateTaskPage() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError(null);

    try {
      await axios.post('/api/tasks', {title});
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating task');
    }
  }

  return (
    <div>
      <h3>Create Task</h3>

      <form onSubmit={submit}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{padding: 8, width: 250}}
        />
        <br /><br />

        <button type="submit">Create</button>
      </form>

      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
