export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getPriorityColor = (priority) => {
  switch (priority) {
  case 'high':
    return '#dc2626';
  case 'medium':
    return '#f59e0b';
  case 'low':
    return '#10b981';
  default:
    return '#6b7280';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
  case 'completed':
    return '#10b981';
  case 'in-progress':
    return '#3b82f6';
  case 'todo':
    return '#6b7280';
  default:
    return '#9ca3af';
  }
};

export const getStatusBadge = (status) => {
  switch (status) {
  case 'completed':
    return '✓ Completed';
  case 'in-progress':
    return '⟳ In Progress';
  case 'todo':
    return '○ To Do';
  default:
    return status;
  }
};
