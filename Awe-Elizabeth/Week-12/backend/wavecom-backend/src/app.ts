import  express, { Request, Response }  from "express";
import cors from "cors";
import connectDb from "./config/db";
import dotenv from "dotenv"
import { connectRabbitMQ } from "./services/rabbitmq";
import notificationRoutes from "./routes/notification.router"
import { startWorker } from "./worker/consumer";
import { apiRateLimiter } from "./services/express-rate-limit";

dotenv.config()


const app = express();

app.use(apiRateLimiter)
app.use(express.json());
app.use(cors());

const port = process.env.PORT || ""

app.use("/api/v1/notification", notificationRoutes)

connectDb(process.env.MONGO_URL || "").then(async () => {
    try {
        await connectRabbitMQ();
        startWorker()
        app.listen(port, () => {
        console.log(`server currently running on port ${port}`)
    })
    } catch (error) {
        console.log(`error connecting to RabbitMq: ${error}`)
    }   
});