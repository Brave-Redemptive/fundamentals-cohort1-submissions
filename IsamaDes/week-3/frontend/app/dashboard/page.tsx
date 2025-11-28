'use client';

import { useEffect, useState } from 'react';
import TodoItem from '../../components/TodoItem';
import { fetchTodos, createTodo, updateTodo, deleteTodo, Todo } from '../services/todoService';
import { useRouter } from 'next/navigation';

export default function Home() {

    const [mounted, setMounted] = useState(false);
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        fetchTodos().then(setTodos);
    }, []);

    if (!mounted) return <div />;

    const handleAdd = async () => {
        if (!title.trim()) return;
        const newTodo = await createTodo(title, priority, dueDate);
        setTodos((prev) => [...prev, newTodo]);
        setTitle('');
    };

    const handleToggle = async (id: string, completed: boolean, priority: 'low' | 'medium' | 'high', dueDate: string) => {
        const updated = await updateTodo(id, !completed, priority, dueDate);
        setTodos((prev) => prev.map((todo) => (todo._id === id ? updated : todo)));
    };

    const handleDelete = async (id: string) => {
        await deleteTodo(id);
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
    };



    return (
        <main>
            <div className="flex justify-between items-center mb-4 h-[50px]  rounded-lg">

                <div className="flex justify-end gap-2 ">
                    <a
                        href="https://github.com/IsamaDes/todo-frontend"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Frontend GitHub
                    </a>
                    <a
                        href="https://github.com/IsamaDes/todo-backend"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Backend GitHub
                    </a>
                </div>


            </div>



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
                        onToggle={() => handleToggle(todo._id, todo.completed, todo.priority, todo.dueDate)}
                        onDelete={() => handleDelete(todo._id)}
                    />
                ))}
            </div>
        </main>
    );
}
