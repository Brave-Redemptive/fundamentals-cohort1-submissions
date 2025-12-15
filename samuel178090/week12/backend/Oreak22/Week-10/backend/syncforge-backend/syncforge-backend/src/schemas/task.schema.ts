import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3),
  completed: z.boolean().default(false),
});
