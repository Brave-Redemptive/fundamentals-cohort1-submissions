import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../config/logger';
import { ProviderResponse } from '../../types';
import { PROVIDER_TIMEOUTS } from '../../utils/constants';

export class PushProvider {
  private readonly providerUrl: string;
  private readonly timeout: number;
  private circuitBreakerFailures: number = 0;
  private circuitBreakerThreshold: number = 5;
  private circuitBreakerResetTime: number = 60000;
  private isCircuitOpen: boolean = false;
  private lastFailureTime?: number;

  constructor() {
    this.providerUrl = process.env.PUSH_PROVIDER_URL || 'https://mock-push-provider.com/send';
    this.timeout = PROVIDER_TIMEOUTS.PUSH;
  }

  async send(deviceToken: string, title: string, message: string): Promise<ProviderResponse> {
    const startTime = Date.now();

    try {
      if (this.isCircuitOpen) {
        if (Date.now() - (this.lastFailureTime || 0) > this.circuitBreakerResetTime) {
          logger.info('Circuit breaker reset, attempting to reconnect');
          this.resetCircuitBreaker();
        } else {
          throw new Error('Circuit breaker is open. Push provider unavailable.');
        }
      }

      // Validate device token
      if (!this.isValidDeviceToken(deviceToken)) {
        throw new Error('Invalid device token format');
      }

      // Mock API call
      const response = await this.mockSendPush(deviceToken, title, message);

      this.circuitBreakerFailures = 0;

      const processingTime = Date.now() - startTime;
      logger.info('Push notification sent successfully', {
        deviceToken: this.maskDeviceToken(deviceToken),
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
      
      logger.error('Push notification send failed', {
        deviceToken: this.maskDeviceToken(deviceToken),
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

  private async mockSendPush(
    deviceToken: string,
    title: string,
    message: string
  ): Promise<{ messageId: string }> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300));

    // Simulate 97% success rate (push is usually most reliable)
    const shouldSucceed = Math.random() > 0.03;

    if (!shouldSucceed) {
      throw new Error('Push provider temporarily unavailable');
    }

    return {
      messageId: `push-${uuidv4()}`
    };
  }

  private isValidDeviceToken(token: string): boolean {
    // FCM/APNS tokens are typically 64+ characters
    return token.length >= 32 && /^[a-zA-Z0-9_-]+$/.test(token);
  }

  private maskDeviceToken(token: string): string {
    if (token.length > 10) {
      return token.slice(0, 5) + '...' + token.slice(-5);
    }
    return '***';
  }

  private handleFailure(): void {
    this.circuitBreakerFailures++;
    this.lastFailureTime = Date.now();

    if (this.circuitBreakerFailures >= this.circuitBreakerThreshold) {
      this.isCircuitOpen = true;
      logger.error('Push provider circuit breaker opened', {
        failures: this.circuitBreakerFailures
      });
    }
  }

  private resetCircuitBreaker(): void {
    this.circuitBreakerFailures = 0;
    this.isCircuitOpen = false;
    logger.info('Push provider circuit breaker reset');
  }

  getStatus(): { available: boolean; failureCount: number } {
    return {
      available: !this.isCircuitOpen,
      failureCount: this.circuitBreakerFailures
    };
  }
}