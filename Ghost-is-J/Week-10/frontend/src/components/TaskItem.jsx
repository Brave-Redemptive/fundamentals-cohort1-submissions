export default function TaskItem({task}) {
  return (
    <div style={{
      padding: 10,
      border: '1px solid #ccc',
      borderRadius: 5,
      marginBottom: 10
    }}
    >
      <strong>{task.title}</strong>
      <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
    </div>
  );
}
