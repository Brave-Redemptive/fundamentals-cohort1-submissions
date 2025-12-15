import { NOTIFICATION_STATUS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    const classes = {
      [NOTIFICATION_STATUS.QUEUED]: 'status-queued',
      [NOTIFICATION_STATUS.PROCESSING]: 'status-processing',
      [NOTIFICATION_STATUS.SENT]: 'status-sent',
      [NOTIFICATION_STATUS.DELIVERED]: 'status-delivered',
      [NOTIFICATION_STATUS.FAILED]: 'status-failed',
      [NOTIFICATION_STATUS.CANCELLED]: 'status-cancelled'
    };
    return classes[status] || 'status-queued';
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;