import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../config/logger';
import { ProviderResponse } from '../../types';
import { PROVIDER_TIMEOUTS } from '../../utils/constants';

export class EmailProvider {
  private readonly providerUrl: string;
  private readonly timeout: number;
  private circuitBreakerFailures: number = 0;
  private circuitBreakerThreshold: number = 5;
  private circuitBreakerResetTime: number = 60000; // 1 minute
  private isCircuitOpen: boolean = false;
  private lastFailureTime?: number;

  constructor() {
    this.providerUrl = process.env.EMAIL_PROVIDER_URL || 'https://mock-email-provider.com/send';
    this.timeout = PROVIDER_TIMEOUTS.EMAIL;
  }

  async send(recipient: string, subject: string, message: string): Promise<ProviderResponse> {
    const startTime = Date.now();

    try {
      // Check circuit breaker
      if (this.isCircuitOpen) {
        if (Date.now() - (this.lastFailureTime || 0) > this.circuitBreakerResetTime) {
          logger.info('Circuit breaker reset, attempting to reconnect');
          this.resetCircuitBreaker();
        } else {
          throw new Error('Circuit breaker is open. Email provider unavailable.');
        }
      }

      // Validate email format
      if (!this.isValidEmail(recipient)) {
        throw new Error('Invalid email address format');
      }

      // Mock API call (in production, this would be actual API call)
      const response = await this.mockSendEmail(recipient, subject, message);

      // Success - reset circuit breaker
      this.circuitBreakerFailures = 0;

      const processingTime = Date.now() - startTime;
      logger.info('Email sent successfully', {
        recipient,
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
      
      logger.error('Email send failed', {
        recipient,
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

  private async mockSendEmail(
    recipient: string, 
    subject: string, 
    message: string
  ): Promise<{ messageId: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

    // Simulate 95% success rate
    const shouldSucceed = Math.random() > 0.05;

    if (!shouldSucceed) {
      throw new Error('Provider temporarily unavailable');
    }

    // In production, this would be:
    /*
    const response = await axios.post(
      this.providerUrl,
      { recipient, subject, message },
      { timeout: this.timeout }
    );
    return { messageId: response.data.messageId };
    */

    return {
      messageId: `email-${uuidv4()}`
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private handleFailure(): void {
    this.circuitBreakerFailures++;
    this.lastFailureTime = Date.now();

    if (this.circuitBreakerFailures >= this.circuitBreakerThreshold) {
      this.isCircuitOpen = true;
      logger.error('Email provider circuit breaker opened', {
        failures: this.circuitBreakerFailures
      });
    }
  }

  private resetCircuitBreaker(): void {
    this.circuitBreakerFailures = 0;
    this.isCircuitOpen = false;
    logger.info('Email provider circuit breaker reset');
  }

  getStatus(): { available: boolean; failureCount: number } {
    return {
      available: !this.isCircuitOpen,
      failureCount: this.circuitBreakerFailures
    };
  }
}