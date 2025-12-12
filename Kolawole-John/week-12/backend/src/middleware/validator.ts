import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { NotificationType, Priority } from '../types';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';

// Notification creation validation schema
export const createNotificationSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(NotificationType))
    .required()
    .messages({
      'any.required': 'Notification type is required',
      'any.only': ERROR_MESSAGES.INVALID_NOTIFICATION_TYPE
    }),

  recipient: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .required()
    .messages({
      'any.required': 'Recipient is required',
      'string.min': 'Recipient must be at least 3 characters',
      'string.max': 'Recipient must not exceed 255 characters'
    }),

  subject: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Subject must not exceed 200 characters'
    }),

  message: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .messages({
      'any.required': 'Message is required',
      'string.min': 'Message cannot be empty',
      'string.max': 'Message must not exceed 5000 characters'
    }),

  priority: Joi.string()
    .valid(...Object.values(Priority))
    .optional()
    .default(Priority.MEDIUM),

  metadata: Joi.object()
    .optional(),

  scheduledAt: Joi.date()
    .iso()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Scheduled time cannot be in the past'
    })
});

// Query parameters validation
export const listNotificationsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(20),

  status: Joi.string()
    .optional(),

  type: Joi.string()
    .valid(...Object.values(NotificationType))
    .optional(),

  priority: Joi.string()
    .valid(...Object.values(Priority))
    .optional()
});

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors
        }
      });
    }

    // Replace request data with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Custom email validator
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Custom phone number validator
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

// Recipient validator based on notification type
export const validateRecipient = (req: Request, res: Response, next: NextFunction) => {
  const { type, recipient } = req.body;

  let isValid = false;
  let errorMessage = '';

  switch (type) {
    case NotificationType.EMAIL:
      isValid = isValidEmail(recipient);
      errorMessage = 'Invalid email address format';
      break;

    case NotificationType.SMS:
      isValid = isValidPhoneNumber(recipient);
      errorMessage = 'Invalid phone number format';
      break;

    case NotificationType.PUSH:
      // Device tokens are typically 32+ characters
      isValid = recipient.length >= 32;
      errorMessage = 'Invalid device token format';
      break;

    default:
      errorMessage = ERROR_MESSAGES.INVALID_NOTIFICATION_TYPE;
  }

  if (!isValid) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        message: errorMessage
      }
    });
  }

  next();
};