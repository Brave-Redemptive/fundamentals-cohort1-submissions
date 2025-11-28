import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import type { Project } from '../types';
import '../styles/ProjectsPage.css';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [teamSize, setTeamSize] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch {
      setError('Failed to load projects. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectService.create({
        name,
        description: desc,
        teamSize,
        status: 'active'
      });
      setName('');
      setDesc('');
      loadProjects();
    } catch {
      alert('Failed to create project');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent navigation
    if (window.confirm('Delete this project?')) {
      await projectService.delete(id);
      loadProjects();
    }
  };

  if (loading) return <div className="loading">Loading Projects...</div>;

  return (
    <div className="container">
      <div style={{display: 'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>Projects</h1>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleCreate} className="create-form">
        <input 
          placeholder="Project Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
        />
        <input 
          placeholder="Description" 
          value={desc} 
          onChange={e => setDesc(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          placeholder="Team Size" 
          value={teamSize} 
          onChange={e => setTeamSize(Number(e.target.value))} 
          style={{width: '100px'}}
        />
        <button type="submit" className="btn-primary">Create Project</button>
      </form>

      <div className="projects-grid">
        {projects.map(project => (
          <div 
            key={project.id} 
            className="project-card"
            onClick={() => navigate(`/projects/${project.id}/tasks`)}
          >
            <div className="card-header">
              <h3>{project.name}</h3>
              <span className="status-badge status-active">{project.status}</span>
            </div>
            <p style={{color: '#666', marginBottom: '1rem'}}>{project.description}</p>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <small>Team Size: {project.teamSize}</small>
              <button 
                className="btn-danger" 
                style={{padding: '4px 8px', fontSize: '0.8rem'}}
                onClick={(e) => handleDelete(e, project.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}