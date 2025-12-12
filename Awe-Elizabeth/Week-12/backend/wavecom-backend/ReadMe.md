#### Architecture Diagram




## Components and Responsibilities

# Service: The service that makes a call to the notification endpoint. It can include a web application, android or an IOS application.
# Endpoint: This is the notification enpoint that creates a new notification job.
# Message Queue: These are the messages already queued and to be processed by RabbitMq
# Worker: The worker service is that the service that consumes and processes each request on the queue
# Notification Logs: This is where information of all created and processed notification is stored
# Provider: This is the components that provided the notification service, which could be mailchimp etc.
# User: The user gets the SMS, Email or Push notifations

## Scaling Strategy : Multiple Queues can be setup using RabbitMQ for horizontal scaling ans well as running multiple instance of the worker servce

## Fault Tolerance Strategy: In this architecture, every layer has built-in mechanisms that ensure messages are not lost and the system recovers automatically since queues are created with the durable: true option. Also worker services are stateles and do not store data in memory, so no data is lost when a worker crashes

## Queing Model and Retry Flow: Once a new notification job is created, the job is queued to be processed by the worker service. If the process fails, the status is updated to be queued again for processing, The maximum retry is 3 times.

## API Design: The api has different endpoints to create notifications, that is the createSmsNotification, createEmailNotification and createPushNotification. Also the api endpoints to fetch the status of a particular noticfication.

## Database Schema



### Design Defence

## Why this Architecture:
# 1. This architecture ensures that the API layer is fast and stateless. The API layer is designed to be fully asynchronous and does not have to wait for the notification to be delivered to return a response, rather notification are queued and processed on the background
# 2. RabbitMQ also acts as a safety buffer between the API and the worker service, hence no data is lost.
# 3. This architecture also supports the retry of a failed notification delivery, which promotes reliability

## How will it handle 50,000 notifications/min?
# 1. With several instances of the API behind a load balance, the system can easily excess 50,000 notifications/min.
# 2. A single RabbitMq node is able to handle about 40,000 messages/min, hence multiple node would handle a lot more

## What are Potential Bottlenecks
# 1. High request volume saturating the API servers
# 2. Workers may process slower than messages arrive
# 3. RabbitMQ can saturate disk when queue size grows very large
# 4. External providers rate may be slower than incoming messages
## Mitigations
# 1. Horizontally scale apis behind load balances
# 2. Rate Limit abusive clients
# 3. Add more RabbitMq node or cluster



