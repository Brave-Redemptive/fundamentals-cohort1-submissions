'use client';

import react, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TodoItem from '../../components/TodoItem';
import { fetchTodos, createTodo, updateTodo, deleteTodo, Todo } from '../services/todoService';
import toast from 'react-hot-toast';


const page = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
 
  useEffect(() => {
  setMounted(true);

  (async () => {
    try {
      console.log("📡 Fetching todos...");
      const data = await fetchTodos();
      console.log("✅ Fetched todos:", data);
      setTodos(data);
    } catch (err) {
      console.error("❌ Error fetching todos:", err);
    }
  })();
}, []);

      if (!mounted) return <div />;

  const handleAdd = async () => {
    if (!title.trim()) return;
    const newTodo = await createTodo(title, priority, dueDate);
    setTodos((prev) => [...prev, newTodo]);
    setTitle('');
  };

  const handleUpdateTodo = async (id: string, completed: boolean, priority: 'low' | 'medium' | 'high', dueDate: string) => {
    const updated = await updateTodo(id, !completed, priority, dueDate);
    setTodos((prev) => prev.map((todo) => (todo._id === id ? updated : todo)));
  };

 const handleDelete = async (id: string) => {
  try {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((todo) => todo._id !== id));
    toast.success("Todo deleted successfully!");
  } catch (error: any) {
    console.error("❌ Delete error:", error);

    // Handle permission error
    if (error.response && error.response.status === 403) {
      toast.error("You do not have permission to delete this todo.");
    } else if (error.response && error.response.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong while deleting the todo.");
    }
  }
};


  return (
    <div className='p-8'>
    <div className='p-8'>
      <h1 className="text-2xl font-bold mb-4">My To-Do App</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="Enter a task..."
        />

        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 rounded">
          Add
        </button>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="border px-2 py-1 rounded"
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </div>
      <div>

        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onToggle={() => handleUpdateTodo(todo._id, todo.completed, todo.priority, todo.dueDate)}
            onDelete={() => handleDelete(todo._id)}
          />
        ))}
      </div>
      </div>
    </div>
  )
}

export default page