import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useApi } from "../hooks/useApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = useApi(async () => api.get("/tasks"));
  const createTask = useApi(async () =>
    api.post("/tasks", { title: newTask, completed: false })
  );

  useEffect(() => {
    fetchTasks.exec().then((value) => {
      const data = value as { success: boolean; data: any[] };

      console.log(data);
      setTasks(data.data);
    });
  }, [loading]);

  const handleCreate = async () => {
    setLoading(true);
    const added = await createTask.exec();
    if (added) {
      setTasks([...tasks, added]);
      setNewTask("");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <Card className="p-4 space-y-3">
        <h2 className="text-xl font-semibold">Tasks</h2>

        <div className="flex gap-2">
          <Input
            placeholder="New Task"
            value={newTask}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTask(e.target.value)
            }
          />
          <Button onClick={handleCreate} disabled={createTask.loading}>
            Add
          </Button>
        </div>

        {fetchTasks.loading && <Skeleton className="h-10" />}

        <ul className="space-y-2">
          {tasks.map((t, i) => (
            <li key={i} className="p-2 border rounded">
              {t.title}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
