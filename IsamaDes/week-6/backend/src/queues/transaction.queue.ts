//why use bullmq, battletested
//perfect for postgres/prisma
// good for scalability of application as transactions run in the background
import { Queue } from "bullmq";
import redis from "../lib/redis.js";


export const transactionQueue = new Queue("transactions", {connection: redis})
  