import amqplib from "amqplib";

let channel: amqplib.Channel | null = null;

export const connectRabbitMQ = async (): Promise<amqplib.Channel> => {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();

    // 1. Create a dedicated Dead Letter Exchange (DLX)
    const dlx = "notifications.dlx";
    await channel.assertExchange(dlx, "direct", { durable: true });

    // 2. Main queue — with proper dead-letter setup
    await channel.assertQueue("notifications", {
      durable: true,
      deadLetterExchange: dlx, 
      deadLetterRoutingKey: "dlq", 
    });

    // 3. Dead Letter Queue (DLQ)
    await channel.assertQueue("dlq", { durable: true });

    // 4. Bind DLQ to the DLX
    await channel.bindQueue("dlq", dlx, "dlq");

    console.log("RabbitMQ Connected → notifications + DLX + dlq ready");

    return channel;
  } catch (err: any) {
    console.error("RabbitMQ connection failed:", err.message);
    process.exit(1);
  }
};

export const getChannel = (): amqplib.Channel => {
  if (!channel) throw new Error("RabbitMQ channel not ready");
  return channel;
};

export const publishToQueue = (message: any) => {
  getChannel().sendToQueue(
    "notifications",
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
};
