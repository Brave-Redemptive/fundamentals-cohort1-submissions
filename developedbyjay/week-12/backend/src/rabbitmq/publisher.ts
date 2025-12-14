import { getChannel } from "./connection";

export const publishToQueue = async (queue: string, msg: any) => {
  const channel = await getChannel();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
};

// docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management