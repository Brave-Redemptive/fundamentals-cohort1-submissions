import { Router } from "express";
import { checkNotificationStatus, createEmailNotification, createPushNotification, createSMSNotification, getNotificationLists } from "../controller/Notification.controller";
const router = Router()

router.post("/sms", createSMSNotification)
router.post("/email", createEmailNotification)
router.post("/push", createPushNotification)
router.get("/status/:id", checkNotificationStatus)
router.get("/", getNotificationLists)




export default router