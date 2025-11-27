// src/components/TaskForm.tsx

import { useState, useEffect } from "react";
import type { CreateTaskDTO, UpdateTaskDTO, Task } from "../types/task.types";

interface TaskFormProps {
  onSubmit: (taskData: CreateTaskDTO | UpdateTaskDTO) => Promise<void>;
  initialData?: Task | null;
  mode?: "create" | "edit";
}

const TaskForm = ({
  onSubmit,
  initialData = null,
  mode = "create",
}: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(
    "pending"
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setStatus(initialData.status);
      setPriority(initialData.priority);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
      });

      // Reset form only if creating
      if (mode === "create") {
        setTitle("");
        setDescription("");
        setStatus("pending");
        setPriority("medium");
      }

      alert(
        mode === "create"
          ? "Task created successfully!"
          : "Task updated successfully!"
      );
    } catch (error) {
      console.error(error);
      alert(
        mode === "create" ? "Failed to create task" : "Failed to update task"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (initialData) {
      // Reset to initial data when editing
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setStatus(initialData.status);
      setPriority(initialData.priority);
    } else {
      // Clear form when creating
      setTitle("");
      setDescription("");
      setStatus("pending");
      setPriority("medium");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        {mode === "create" ? "Create New Task" : "Edit Task"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task title"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter task description"
            disabled={isSubmitting}
          />
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as "pending" | "in-progress" | "completed"
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create Task"
              : "Update Task"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
