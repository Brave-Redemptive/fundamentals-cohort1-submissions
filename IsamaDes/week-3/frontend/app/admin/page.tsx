"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, ClipboardList, Settings, ChevronDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getAdminOverview, getActiveClients } from "../services/authService";
import { fetchTodos, updateTodo, createTodo, deleteTodo, Todo, fetchTodoByUser } from '../services/todoService';
import TodoItem from '../../components/TodoItem';
import Link from "next/link";



interface AdminStats {
  totalUsers: number;
  totalTasks: number;
  activeClients: number;
}

interface Client{
  _id: string;
  name: string;
  email: string;
}

export default function AdminDashboardPage() {
  const {userId} = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([])
  const [showClients, setShowClients] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [dueDate, setDueDate] = useState('');



  useEffect(() => {
  setMounted(true);

  (async () => {
    try {
      const data = await fetchTodoByUser(userId as string);
      setTodos(data);
    } catch (err) {
      console.error("❌ Error fetching todos:", err);
    }
  })();
}, []);

const handleDisplayClients = async () => {
  if(!showClients){
    try{
      const response = await getActiveClients();
      setClients(response);
    }catch(err){
    console.error("Error fetching active clients:", err);
    }
  }
};


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getAdminOverview();
        setStats(data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load admin dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
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
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    };


  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div>
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => router.push("/admin/settings")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Settings className="w-5 h-5" />
          Manage Settings
        </button>
      </header>

      {/* <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={<Users className="text-blue-500 w-6 h-6" />}
        />
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks ?? 0}
          icon={<ClipboardList className="text-green-500 w-6 h-6" />}
        />
 
         <StatCard 
         
          onClick={() => setShowClients((prev) => !prev)}>
          <div className="flex items-center justify-between bg-red-500">
            <div className="flex flex-col">
            <p className="text-gray-500 text-sm">Active Clients</p>
            <h3 className="text-2xl font-bold text-gray-900">
                {stats?.activeClients ?? 0}
            </h3></div>
            <div className="flex flex-col">
             <div className="bg-purple-50 p-3 rounded-full">
              <Users className="text-purple-500 w-6 h-6" />
            </div>
             <ChevronDown
              className={`ml-2 w-5 h-5 text-gray-500 transform transition-transform ${
                showClients ? "rotate-180" : ""
              }`}
            /></div>
          </div>


        <div className="relative">

         {showClients && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-xl z-10">
           <ul className="divide-y divide-gray-100">
            {clients.length > 0 ? (
            clients.map((client) => (
            <li key={client._id} className="p-3 hover:bg-gray-50">
              <Link
                href={`/admin/client/${client._id}`}
                className="text-blue-600 hover:underline"
              >
                {client.name || client.email}
              </Link>
            </li>
            ))
          ) : (
          <li className="p-3 text-gray-500 text-sm">No active clients found.</li>
          )}
         </ul>
        </div>
         )}
        </div>

      
       
       
        </section> */}


<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <StatCard
    title="Total Users"
    value={stats?.totalUsers ?? 0}
    icon={<Users className="text-blue-500 w-6 h-6" />}
  />

  <StatCard
    title="Total Tasks"
    value={stats?.totalTasks ?? 0}
    icon={<ClipboardList className="text-green-500 w-6 h-6" />}
  />

  {/* Active Clients Card */}
  <div
    onClick={() => setShowClients((prev) => !prev)}
    className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer transition-all"
  >
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <p className="text-gray-500 text-sm">Active Clients</p>
        <h3 className="text-2xl font-bold text-gray-900">
          {stats?.activeClients ?? 0}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-purple-50 p-3 rounded-full">
          <Users className="text-purple-500 w-6 h-6" />
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transform transition-transform ${
            showClients ? "rotate-180" : ""
          }`}
        />
      </div>
    </div>

    {showClients && (
      <div className="mt-3 bg-white shadow-lg rounded-xl border border-gray-100">
        <ul className="divide-y divide-gray-100">
          {clients.length > 0 ? (
            clients.map((client) => (
              <li key={client._id} className="p-3 hover:bg-gray-50">
                <Link
                  href={`/admin/client/${client._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {client.name || client.email}
                </Link>
              </li>
            ))
          ) : (
            <li className="p-3 text-gray-500 text-sm">
              No active clients found.
            </li>
          )}
        </ul>
      </div>
    )}
  </div>
</section>


      <section className="mt-12 bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
        <p className="text-gray-500 text-sm">No recent activity available yet.</p>
      </section>
     </div>


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
    </main>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    </div>
  );
}
