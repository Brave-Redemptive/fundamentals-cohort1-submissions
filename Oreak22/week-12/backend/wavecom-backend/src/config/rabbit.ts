import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbit = async () => {
  const conn = await amqp.connect(process.env.RABBITMQ_URL as string);
  channel = await conn.createChannel();

  await channel.assertQueue(process.env.QUEUE_NAME as string);
  await channel.assertQueue(process.env.RETRY_QUEUE as string);

  console.log("RabbitMQ connected");
};

export const getChannel = () => channel;
