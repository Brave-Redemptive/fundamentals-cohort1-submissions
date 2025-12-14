import { Counter, Gauge, Histogram, Registry } from 'prom-client';

class MetricsCollector {
  private registry: Registry;
  
  // Counters
  public notificationsCreated: Counter;
  public notificationsSent: Counter;
  public notificationsFailed: Counter;
  public notificationsRetried: Counter;
  
  // Gauges
  public queueDepth: Gauge;
  public activeWorkers: Gauge;
  public databaseConnections: Gauge;
  
  // Histograms
  public processingDuration: Histogram;
  public queueWaitTime: Histogram;

  constructor() {
    this.registry = new Registry();

    // Initialize counters
    this.notificationsCreated = new Counter({
      name: 'notifications_created_total',
      help: 'Total number of notifications created',
      labelNames: ['type'],
      registers: [this.registry]
    });

    this.notificationsSent = new Counter({
      name: 'notifications_sent_total',
      help: 'Total number of notifications successfully sent',
      labelNames: ['type'],
      registers: [this.registry]
    });

    this.notificationsFailed = new Counter({
      name: 'notifications_failed_total',
      help: 'Total number of notifications that failed',
      labelNames: ['type', 'reason'],
      registers: [this.registry]
    });

    this.notificationsRetried = new Counter({
      name: 'notifications_retried_total',
      help: 'Total number of notification retry attempts',
      labelNames: ['type'],
      registers: [this.registry]
    });

    // Initialize gauges
    this.queueDepth = new Gauge({
      name: 'queue_depth',
      help: 'Current number of messages in queue',
      labelNames: ['queue'],
      registers: [this.registry]
    });

    this.activeWorkers = new Gauge({
      name: 'active_workers',
      help: 'Number of active worker processes',
      registers: [this.registry]
    });

    this.databaseConnections = new Gauge({
      name: 'database_connections',
      help: 'Number of active database connections',
      registers: [this.registry]
    });

    // Initialize histograms
    this.processingDuration = new Histogram({
      name: 'notification_processing_duration_seconds',
      help: 'Time taken to process a notification',
      labelNames: ['type', 'status'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [this.registry]
    });

    this.queueWaitTime = new Histogram({
      name: 'queue_wait_time_seconds',
      help: 'Time a message spends in queue before processing',
      labelNames: ['queue'],
      buckets: [0.1, 1, 5, 10, 30, 60],
      registers: [this.registry]
    });
  }

  public getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  public incrementCreated(type: string): void {
    this.notificationsCreated.inc({ type });
  }

  public incrementSent(type: string): void {
    this.notificationsSent.inc({ type });
  }

  public incrementFailed(type: string, reason: string): void {
    this.notificationsFailed.inc({ type, reason });
  }

  public incrementRetried(type: string): void {
    this.notificationsRetried.inc({ type });
  }

  public setQueueDepth(queue: string, depth: number): void {
    this.queueDepth.set({ queue }, depth);
  }

  public setActiveWorkers(count: number): void {
    this.activeWorkers.set(count);
  }

  public recordProcessingDuration(type: string, status: string, durationSeconds: number): void {
    this.processingDuration.observe({ type, status }, durationSeconds);
  }

  public recordQueueWaitTime(queue: string, waitTimeSeconds: number): void {
    this.queueWaitTime.observe({ queue }, waitTimeSeconds);
  }
}

export const metrics = new MetricsCollector();