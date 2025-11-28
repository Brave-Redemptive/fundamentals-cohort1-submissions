// Fix 1: Import useCallback
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { taskService } from '../services/api';
import type { Task } from '../types';
import '../styles/TasksPage.css';

const COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' }
];

export default function TasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Task Form
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  // Fix 2: Wrap loadTasks in useCallback to stabilize it
  const loadTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await taskService.getAll(projectId);
      setTasks(data);
    } catch {
       // Fix 3: Removed unused 'err'
      console.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Fix 4: Add loadTasks to dependency array
  useEffect(() => {
    if (projectId) loadTasks();
  }, [projectId, loadTasks]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    try {
      await taskService.create({
        title,
        description: 'No description',
        projectId,
        priority,
        status: 'todo',
        assignee
      });
      setTitle('');
      setAssignee('');
      loadTasks();
    } catch {
      // Fix 5: Removed unused 'err'
      alert('Error creating task');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    const oldTasks = [...tasks];
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    try {
      await taskService.updateStatus(taskId, newStatus);
    } catch {
      setTasks(oldTasks); 
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete task?')) {
      await taskService.delete(id);
      loadTasks();
    }
  };

  if (loading) return <div className="loading">Loading Board...</div>;

  return (
    <div className="container">
      <Link to="/" style={{textDecoration:'none', color:'#667eea'}}>← Back to Projects</Link>
      
      <div className="board-header">
        <h2>Board</h2>
        <form onSubmit={handleCreate} style={{display:'flex', gap:'10px'}}>
          <input placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <input placeholder="Assignee" value={assignee} onChange={e => setAssignee(e.target.value)} required />
          <select 
             value={priority} 
             /* Fix 6: Remove 'any' and cast to specific type */
             onChange={e => setPriority(e.target.value as Task['priority'])}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit" className="btn-primary">Add Task</button>
        </form>
      </div>

      <div className="kanban-board">
        {COLUMNS.map(col => (
          <div key={col.id} className="kanban-column">
            <div className="column-header">
              {col.label}
              <span>{tasks.filter(t => t.status === col.id).length}</span>
            </div>
            
            {tasks.filter(t => t.status === col.id).map(task => (
              <div key={task.id} className={`task-card priority-${task.priority}`}>
                <strong>{task.title}</strong>
                <div style={{fontSize:'0.8rem', color:'#666', marginTop:'5px'}}>
                  {task.assignee}
                </div>
                
                <div className="task-actions">
                  <select 
                    value={task.status} 
                    /* Fix 7: Remove 'any' and cast to specific type */
                    onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                  >
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  
                  <button 
                    onClick={() => handleDelete(task.id)}
                    style={{color:'red', background:'none', padding:0}}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}