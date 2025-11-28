import React from 'react';

interface HealthCardProps {
  title: string;
  value: string | number;
  status?: 'UP' | 'DOWN' | string;
}

const HealthCard: React.FC<HealthCardProps> = ({ title, value, status }) => {
  const getStatusColor = (): string => {
    if (status === 'UP') return 'up';
    if (status === 'DOWN') return 'down';
    return '';
  };

  return (
    <div className="card">
      <h3>{title}</h3>
      <div className={`status-indicator ${getStatusColor()}`}>
        {value}
      </div>
    </div>
  );
};

export default HealthCard;