// src/App.tsx

import { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import { useTasks } from "./hooks/useTasks";
import type { CreateTaskDTO, UpdateTaskDTO, Task } from "./types/task.types";

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } =
    useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Unified handler for both create and update
  const handleSubmit = async (taskData: CreateTaskDTO | UpdateTaskDTO) => {
    if (editingTask) {
      // Edit mode
      const updated = await updateTask(
        editingTask.id,
        taskData as UpdateTaskDTO
      );
      if (updated) {
        setEditingTask(null);
        setShowForm(false);
      }
    } else {
      // Create mode
      const newTask = await createTask(taskData as CreateTaskDTO);
      if (newTask) {
        setShowForm(false);
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              SyncForge Task Manager
            </h1>
            <button
              onClick={() => {
                if (showForm) {
                  handleCancelEdit();
                } else {
                  setShowForm(true);
                }
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Cancel" : "Add Task"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <TaskForm
            onSubmit={handleSubmit}
            initialData={editingTask}
            mode={editingTask ? "edit" : "create"}
          />
        )}

        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <TaskList tasks={tasks} onDelete={deleteTask} onEdit={handleEdit} />
        )}
      </main>
    </div>
  );
}

export default App;
