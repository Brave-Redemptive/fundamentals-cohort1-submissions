import { useState, useEffect } from 'react';
import TeamMemberCard from '../components/TeamMemberCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { teamAPI } from '../services/api';
import './TeamPage.css';

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await teamAPI.getAllMembers();
      // backend returns { success, message, data: members }
      setMembers(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const getUniqueRoles = () => {
    return [...new Set(members.map(m => m.role))];
  };

  const getFilteredMembers = () => {
    if (filterRole === 'all') return members;
    return members.filter(m => m.role === filterRole);
  };

  if (loading) {
    return <LoadingSpinner message="Loading team members..." />;
  }

  const filteredMembers = getFilteredMembers();
  const uniqueRoles = getUniqueRoles();

  return (
    <div className="team-page">
      <div className="page-header">
        <h2>👥 Team Members</h2>
        <p className="subtitle">Global distributed team working together</p>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchMembers} />}

      <div className="filters">
        <span className="filter-label">Filter by role:</span>
        <button
          className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
          onClick={() => setFilterRole('all')}
        >
          All ({members.length})
        </button>
        {uniqueRoles.map(role => (
          <button
            key={role}
            className={`filter-btn ${filterRole === role ? 'active' : ''}`}
            onClick={() => setFilterRole(role)}
          >
            {role} ({members.filter(m => m.role === role).length})
          </button>
        ))}
      </div>

      <div className="team-grid">
        {filteredMembers.length === 0 ? (
          <div className="empty-state">
            <p>No team members found.</p>
          </div>
        ) : (
          filteredMembers.map(member => (
            <TeamMemberCard key={member.id} member={member} />
          ))
        )}
      </div>

      <div className="team-stats">
        <div className="stat">
          <span className="stat-label">Total Members</span>
          <span className="stat-value">{members.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Roles</span>
          <span className="stat-value">{uniqueRoles.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Timezones</span>
          <span className="stat-value">{new Set(members.map(m => m.timezone)).size}</span>
        </div>
      </div>
    </div>
  );
}
