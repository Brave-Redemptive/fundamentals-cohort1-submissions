import amqp, { Channel, ChannelModel } from "amqplib";
import dotenv from "dotenv"

dotenv.config()


let channel: Channel | null = null;
let connection: ChannelModel | null = null;

export const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL as string);
        channel = await connection.createChannel();
        console.log("RabbitMQ connected");
    } catch (error) {
        console.log(`error connecting to RabbitMq: ${error}`)
    }
};

export const sendToQueue = async (queue: string, payload: any) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
};

export const consumeQueue = async (queue: string, handler: (msg: any) => void) => {
  if (!channel) throw new Error("Channel not initialized");

  channel.consume(queue, (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      console.log(`Consumed from ${queue}:`, content);
      handler(content);
      channel?.ack(msg)
    }
  });
};


// export const consumeQueue = async (queue: string, msg: any) => {
//      if (!channel) throw new Error("Channel not initialized");

//      channel.consume(queue, (msg) => {
//     if (msg) {
//       const content = JSON.parse(msg.content.toString());
//       console.log(`Consumed from ${queue}:`, content);
//       channel?.ack(msg)
//     }
//   });
// }

