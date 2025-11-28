import '../../styles/team.css';

export const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} className="user-avatar" />
      <div className="user-info">
        <h3>{user.name}</h3>
        <p className="role">{user.role}</p>
        <p className="email">{user.email}</p>
        <p className="timezone">🌍 {user.timezone}</p>
        <p className="joined">Joined: {user.joinedAt}</p>
      </div>
    </div>
  );
};

export default UserCard;
