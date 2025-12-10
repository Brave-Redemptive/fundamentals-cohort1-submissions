import amqp from "amqplib";

let connection: amqp.Connection;
let channel: amqp.Channel;

export const initRabbit = async () => {
  connection = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost:15672"
  );
  channel = await connection.createChannel();
  console.log("RabbitMQ connected");
};

export const getChannel = async () => {
  if (!channel) await initRabbit();
  return channel;
};
