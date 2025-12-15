import '../../styles/team.css';
import UserCard from './UserCard';
import LoadingSpinner from '../common/LoadingSpinner';

export const UserList = ({ users, loading, error }) => {
  if (loading) return <LoadingSpinner message="Loading team members..." />;
  
  if (error) {
    return (
      <div className="error-message">
        <p>❌ Error: {error}</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="empty-state">
        <p>👥 No team members found</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;
