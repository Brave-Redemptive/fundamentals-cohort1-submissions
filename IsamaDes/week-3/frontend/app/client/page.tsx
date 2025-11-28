"use client";

import React, { useEffect, useState } from "react";
import { Loader2, User, Mail , Calendar, Search} from "lucide-react";
import { ClientData, clientUser } from "../services/authService";
import { useRouter } from "next/navigation";
import TodoItem from '../../components/TodoItem';
import { fetchTodos, searchTodos, filterTodos, createTodo, updateTodo, deleteTodo, Todo } from '../services/todoService';
import toast from 'react-hot-toast';


export default function ClientProfilePage() {
  const router = useRouter();
  const [client, setClient] = useState<ClientData | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchResponse, setSearchResponse] = useState([]);

 useEffect(() => {
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


  useEffect(() => {
    const fetchProfile = async () => {
      try {
    
        const response = await clientUser();
        setClient(response)

        if(response?.id){
         const todosData = await fetchTodos();
          setTodos(todosData || []);
        }
      } catch (err: any) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);


  const handleSearch = async(searchQuery: string) => {

  if (!searchQuery) return;
  setLoading(true);

  try{
  const data = await searchTodos(searchQuery);
  setTodos(data.data || []);
  }catch(err){
  console.error(err);
  }finally{setLoading(false)}
  }


    const handleFilter = async () => {
    if (!filterDate) return;

    setLoading(true);
    try {
      const data = await filterTodos(filterDate);
      setTodos(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  if (!client)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No client data available
      </div>
    );

    const handleCreateTodo = () => router.push('/create-todo');

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
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Client Profile
      </h1>

      <div className="flex justify-between mb-10 ">
        <div> <div className=" text-center flex flex-col gap-3">
           <button
            onClick={() => alert("Edit feature coming soon!")}
            className="px-6 py-2 bg-blue-300 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Edit Profile
          </button>
          <button onClick={handleCreateTodo} className="px-6 py-2 bg-blue-300 hover:bg-blue-700 text-white rounded-lg font-medium transition">
            Create Todos
          </button>
          <button className="px-6 py-2 bg-blue-300 hover:bg-blue-700 text-white rounded-lg font-medium transition">
            Settings
          </button>
        </div></div>
        <div>
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-600" />
          <span className="font-medium">{client.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-600" />
          <span>{client.email}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium">Role:</span>
          <span>{client.role}</span>
        </div>

        {client.createdAt && (
          <div className="text-sm text-gray-500 mt-4">
            Joined: {new Date(client.createdAt).toLocaleDateString()}
          </div>
        )}

        </div>
      </div>

      <div className="text-lg mb-3">
        See Your Todos
      </div>

           {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex items-center justify-between ">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            className="  p-1 bg-green-600 rounded-md text-white hover:bg-green-700"
          >
            <Search size={18} />
          </button>
        </div>
        <div className=" flex gap-2">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
          />
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Calendar size={18} />
          </button>
        </div>
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

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
        </div>
      ) : todos.length === 0 ? (
        <div className="text-gray-500 text-center">No todos found</div>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="p-3 border border-gray-200 rounded-md shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{todo.title}</h3>
                <p className="text-gray-400 text-xs">
                  Created: {new Date(todo.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                {todo.completed ? (
                  <span className="text-green-600 font-medium">Done</span>
                ) : (
                  <span className="text-red-500 font-medium">Pending</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



