import { PrismaClient } from "@prisma/client"
import { transactionQueue } from "../queues/transaction.queue.js";
import { ok, fail, Result } from "../lib/result.js";

const prisma = new PrismaClient();

type TxError = { message: string; status: number };

export const createTransaction = async({userId, productId, amountCents}: any): Promise<Result<any, TxError>> => {
    try{
    const transaction = await prisma.transaction.create({
    data: {userId, productId, amountCents, status: "PENDING"},
   });

   //Add trasction task to background worker handled by redis and queue from bullmq
   await transactionQueue.add("ProcessingTransaction", {id: transaction.id});

   return ok (transaction);
    }catch(err){
  return fail({ message: "Failed to create transaction", status: 500 });

    }

};


export const getUserRecentTransactions = async (userId: string, sinceDate: Date): Promise<Result<any[], TxError>> => {
    try{
       const tx = await prisma.transaction.findMany({
        where: {userId, createdAt: {gte: sinceDate}},
        orderBy: {createdAt: 'desc'}
    })
    return ok(tx)
    }catch(err){
    return fail({ message: "Error fetching transactions", status: 500 });

    }
}
