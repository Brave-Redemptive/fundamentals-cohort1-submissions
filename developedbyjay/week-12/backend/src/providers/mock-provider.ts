export const sendMockNotification = async (type: string, payload: any) => {
  console.log(`Sending ${type}:`, payload);
  await new Promise((r) => setTimeout(r, 500));
  if (Math.random() < 0.1) throw new Error("Random provider failure");
};
