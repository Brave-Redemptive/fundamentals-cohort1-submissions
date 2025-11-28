import axiosInstance from "../../utils/AxiosInstance";

export interface Todo {
  _id: string,
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await axiosInstance.get<Todo[]>("/todo/getTodos");
  console.log("📦 Raw todos response:", response.data);
  return response.data;
};

export const createTodo = async (title: string, priority: 'low' | 'medium' | 'high', dueDate: string): Promise<Todo> => {
  const response = await axiosInstance.post<Todo>("/todo/createTodo", { title, priority, dueDate });
  return response.data;
};

export const updateTodo = async (id: string, completed: boolean, priority: 'low' | 'medium' | 'high', dueDate: string): Promise<Todo> => {
  const response = await axiosInstance.put<Todo>(`/todo/updateTodo/${id}`, { completed, priority, dueDate });
  return response.data;
};

 export const searchTodos = async (query: string) => {
    const { data } = await axiosInstance.post("/todo/search", { query });
    return data;
  };

  export const filterTodos = async (date: string) => {
    const { data } = await axiosInstance.post("/todo/filter", { date });
    return data;
  };

  export const fetchTodoByUser = async(userId: string) => {
  const response = await axiosInstance.get(`/admin/user/${userId}`);
  return response.data;
}

export const deleteTodo = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/todo/delete/${id}`);
};




 