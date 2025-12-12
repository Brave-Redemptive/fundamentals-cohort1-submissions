import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../config/logger';
import { ProviderResponse } from '../../types';
import { PROVIDER_TIMEOUTS } from '../../utils/constants';

export class SMSProvider {
  private readonly providerUrl: string;
  private readonly timeout: number;
  private circuitBreakerFailures: number = 0;
  private circuitBreakerThreshold: number = 5;
  private circuitBreakerResetTime: number = 60000;
  private isCircuitOpen: boolean = false;
  private lastFailureTime?: number;

  constructor() {
    this.providerUrl = process.env.SMS_PROVIDER_URL || 'https://mock-sms-provider.com/send';
    this.timeout = PROVIDER_TIMEOUTS.SMS;
  }

  async send(recipient: string, message: string): Promise<ProviderResponse> {
    const startTime = Date.now();

    try {
      if (this.isCircuitOpen) {
        if (Date.now() - (this.lastFailureTime || 0) > this.circuitBreakerResetTime) {
          logger.info('Circuit breaker reset, attempting to reconnect');
          this.resetCircuitBreaker();
        } else {
          throw new Error('Circuit breaker is open. SMS provider unavailable.');
        }
      }

      // Validate phone number format
      if (!this.isValidPhoneNumber(recipient)) {
        throw new Error('Invalid phone number format');
      }

      // Mock API call
      const response = await this.mockSendSMS(recipient, message);

      this.circuitBreakerFailures = 0;

      const processingTime = Date.now() - startTime;
      logger.info('SMS sent successfully', {
        recipient: this.maskPhoneNumber(recipient),
        messageId: response.messageId,
        processingTime
      });

      return {
        success: true,
        messageId: response.messageId,
        timestamp: new Date()
      };

    } catch (error) {
      this.handleFailure();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error('SMS send failed', {
        recipient: this.maskPhoneNumber(recipient),
        error: errorMessage,
        processingTime: Date.now() - startTime
      });

      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    }
  }

  private async mockSendSMS(recipient: string, message: string): Promise<{ messageId: string }> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500));

    // Simulate 93% success rate
    const shouldSucceed = Math.random() > 0.07;

    if (!shouldSucceed) {
      throw new Error('SMS provider temporarily unavailable');
    }

    return {
      messageId: `sms-${uuidv4()}`
    };
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Accept formats: +1234567890, +12 345 678 90, (123) 456-7890
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  }

  private maskPhoneNumber(phone: string): string {
    // Mask middle digits for privacy in logs
    if (phone.length > 6) {
      return phone.slice(0, 3) + '****' + phone.slice(-3);
    }
    return '***';
  }

  private handleFailure(): void {
    this.circuitBreakerFailures++;
    this.lastFailureTime = Date.now();

    if (this.circuitBreakerFailures >= this.circuitBreakerThreshold) {
      this.isCircuitOpen = true;
      logger.error('SMS provider circuit breaker opened', {
        failures: this.circuitBreakerFailures
      });
    }
  }

  private resetCircuitBreaker(): void {
    this.circuitBreakerFailures = 0;
    this.isCircuitOpen = false;
    logger.info('SMS provider circuit breaker reset');
  }

  getStatus(): { available: boolean; failureCount: number } {
    return {
      available: !this.isCircuitOpen,
      failureCount: this.circuitBreakerFailures
    };
  }
}