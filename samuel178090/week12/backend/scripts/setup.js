/**
 * Setup Script - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up WaveCom Notification System...');
console.log('Author: Samuel Ajewole (PG/CSC/250006)');

// Create logs directory
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Created logs directory');
}

// Create uploads directory (if needed)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Check environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'RABBITMQ_URL',
  'JWT_SECRET'
];

console.log('\n🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n💡 Please check your .env file');
} else {
  console.log('✅ All required environment variables are set');
}

// Display system info
console.log('\n📊 System Information:');
console.log(`   Node.js Version: ${process.version}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   Architecture: ${process.arch}`);
console.log(`   Memory: ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`);

console.log('\n🎯 Setup completed!');
console.log('Next steps:');
console.log('1. Start MongoDB: docker-compose up -d mongodb');
console.log('2. Start RabbitMQ: docker-compose up -d rabbitmq');
console.log('3. Start backend: npm run dev');
console.log('4. Start worker: npm run worker');
console.log('\n🌟 Happy coding, Samuel!');