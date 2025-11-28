import { Todo } from "../app/services/todoService";

interface Props {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500 bg-red-50";
      case "medium":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-4 border-green-500 bg-green-50";
      default:
        return "border-l-4 border-gray-300";
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded mb-2 shadow ${getPriorityClasses(
        todo.priority
      )}`}
    >
      <div>
        <p className={todo.completed ? "line-through" : ""}>{todo.title}</p>
        <span className="text-xs italic text-gray-600">
         Priority: {todo.priority ? todo.priority.toUpperCase() : "N/A"}
        </span>
      </div>
      {todo.dueDate && (
          <span className="text-xs text-gray-500">
            Due: {new Date(todo.dueDate).toLocaleString()}
          </span>
        )}
      <div className="flex gap-2">
        <button onClick={onToggle} className="bg-green-600 text-white p-2 rounded-md">
          Completed
        </button>
        <button onClick={onDelete} className="bg-red-600 p-2 rounded-md">
          Delete
        </button>
      </div>
    </div>
  );
}
