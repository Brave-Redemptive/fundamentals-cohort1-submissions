import {Request, Response} from 'express'
import NotificationJob, {INotificationJob} from '../models/NotificationJob'
import NotificationLog, {INotificationLog} from '../models/NotificationLog'
import { notificationChannels, notificationStatus } from '../utils/enums'
import { sendToQueue } from '../services/rabbitmq'
import { resourceUsage } from 'process'

export const createSMSNotification = async (req: Request, res: Response) => {
    try {
        const {phoneNumber, message} = req.body
        if(!phoneNumber || !message){
            return res.status(400).json({success: false, message: "phoneNumber and message is required"})
        }

        const smsNotification = await NotificationJob.create({
            phoneNumber,
            message,
            channel: notificationChannels.sms,
            status: notificationStatus.queued
        });

        await NotificationLog.create({
            notificationJobId : smsNotification._id,
            event: "job-created",
            status: notificationStatus.success,
            channel: notificationChannels.sms
        });

        sendToQueue(notificationChannels.sms, smsNotification )

        return res.status(200).json({success: true, message: "sucess"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: "failed"})
    }
}

export const createEmailNotification = async (req: Request, res: Response) => {
    try {
        const {email, message} = req.body
        if(!email || !message){
            return res.status(400).json({success: false, message: "phoneNumber and message is required"})
        }

        const emailNotification = await NotificationJob.create({
            email,
            message,
            channel: notificationChannels.email,
            status: notificationStatus.queued
        });

        await NotificationLog.create({
            notificationJobId : emailNotification._id,
            event: "job-created",
            status: notificationStatus.success,
            channel: notificationChannels.email
        });

        sendToQueue(notificationChannels.email, emailNotification )

        return res.status(200).json({success: true, message: "sucess"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: "failed"})
    }
}

export const createPushNotification = async (req: Request, res: Response) => {
    try {
        const {deviceId, message} = req.body
        if(!deviceId || !message){
            return res.status(400).json({success: false, message: "phoneNumber and message is required"})
        }

        const pushNotification = await NotificationJob.create({
            deviceId,
            message,
            channel: notificationChannels.email,
            status: notificationStatus.queued
        });

        await NotificationLog.create({
            notificationJobId : pushNotification._id,
            event: "job-created",
            status: notificationStatus.success,
            channel: notificationChannels.email
        });

        sendToQueue(notificationChannels.email, pushNotification )

        return res.status(200).json({success: true, message: "sucess"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: "failed"})
    }
}
export const checkNotificationStatus = async (req: Request, res: Response) => {
    try {
        const job = await NotificationJob.findById(req.params.id)
        if(!job){
            return res.status(400).json({success: false, message: "job does not exist"})
        }
        return res.status(200).json({success: true, message: "success", result: {jobId: job._id, status: job.status}})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: "failed"})
    }
}

export const getNotificationLists = async (req: Request, res: Response) => {
    try {
        const jobs = await NotificationJob.findById()
  
        return res.status(200).json({success: true, message: "success", result: jobs})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: "failed"})
    }
}