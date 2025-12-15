import './TeamMemberCard.css';

export default function TeamMemberCard({ member }) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="team-card">
      <div className="team-avatar">{getInitials(member.name)}</div>
      <div className="team-info">
        <h4>{member.name}</h4>
        <p className="role">👔 {member.role}</p>
        <p className="email">✉️ {member.email}</p>
        <p className="timezone">🌍 {member.timezone}</p>
      </div>
    </div>
  );
}
