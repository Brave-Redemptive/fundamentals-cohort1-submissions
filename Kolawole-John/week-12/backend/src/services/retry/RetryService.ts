import { logger } from '../../config/logger';
import { RetryStrategy } from '../../types';
import { RETRY_CONFIG } from '../../utils/constants';

export class RetryService {
  private strategy: RetryStrategy;

  constructor() {
    this.strategy = {
      maxAttempts: RETRY_CONFIG.MAX_ATTEMPTS,
      backoffMultiplier: RETRY_CONFIG.BACKOFF_MULTIPLIER,
      initialDelayMs: RETRY_CONFIG.INITIAL_DELAY_MS
    };
  }

  shouldRetry(currentAttempt: number): boolean {
    return currentAttempt < this.strategy.maxAttempts;
  }

  calculateDelay(attemptNumber: number): number {
    // Exponential backoff: delay = initialDelay * (multiplier ^ attemptNumber)
    const exponentialDelay = 
      this.strategy.initialDelayMs * 
      Math.pow(this.strategy.backoffMultiplier, attemptNumber);

    // Cap at max delay to prevent extremely long waits
    const cappedDelay = Math.min(exponentialDelay, RETRY_CONFIG.MAX_DELAY_MS);

    // Add jitter (±20%) to prevent thundering herd
    const jitter = cappedDelay * 0.2 * (Math.random() - 0.5);
    const finalDelay = Math.floor(cappedDelay + jitter);

    logger.debug('Calculated retry delay', {
      attemptNumber,
      delay: finalDelay,
      maxAttempts: this.strategy.maxAttempts
    });

    return finalDelay;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.strategy.maxAttempts; attempt++) {
      try {
        logger.debug(`Executing operation: ${context}`, { attempt });
        return await operation();

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        if (attempt < this.strategy.maxAttempts) {
          const delay = this.calculateDelay(attempt);
          
          logger.warn(`Operation failed: ${context}. Retrying...`, {
            attempt,
            nextRetryIn: delay,
            error: lastError.message
          });

          await this.sleep(delay);
        } else {
          logger.error(`Operation failed after max retries: ${context}`, {
            attempts: attempt + 1,
            error: lastError.message
          });
        }
      }
    }

    throw lastError || new Error('Operation failed after retries');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getRetryInfo(attemptNumber: number): {
    shouldRetry: boolean;
    nextDelay: number;
    attemptsRemaining: number;
  } {
    return {
      shouldRetry: this.shouldRetry(attemptNumber),
      nextDelay: this.calculateDelay(attemptNumber),
      attemptsRemaining: Math.max(0, this.strategy.maxAttempts - attemptNumber)
    };
  }

  updateStrategy(newStrategy: Partial<RetryStrategy>): void {
    this.strategy = {
      ...this.strategy,
      ...newStrategy
    };

    logger.info('Retry strategy updated', this.strategy);
  }
}

export const retryService = new RetryService();