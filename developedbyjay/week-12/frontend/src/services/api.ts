export type MessagePayload = {
  channel: "email" | "sms" | "push";
  to: string;
  template?: string;
  data?: Record<string, any>;
};
export const createJob = async (type: string, payload: Record<string, any>) => {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload }),
  });
  if (!res.ok) throw new Error("Failed to create job");
  return res.json();
};

export const listJobs = async () => {
  const res = await fetch("/api/jobs");
  if (!res.ok) throw new Error("Failed to list jobs");
  return res.json();
};

export const getJob = async (id: string) => {
  const res = await fetch(`/api/jobs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch job");
  return res.json();
};
