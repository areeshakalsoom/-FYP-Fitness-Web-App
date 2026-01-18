const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  console.log('🔄 Starting MongoDB connection...');

  // Start a timer that logs every second
  let seconds = 0;
  const timer = setInterval(() => {
    seconds++;
    process.stdout.write(`⏳ Connecting... ${seconds}s\r`);
  }, 1000);

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Stop the timer when done
    clearInterval(timer);

    console.log('\n------------------------------------------------');
    console.log(`✅ MongoDB Connected!`);
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`⏱ Connection attempt duration: ${seconds} seconds`);
    console.log('------------------------------------------------');
  } catch (error) {
    clearInterval(timer);
    console.log('\n❌ MongoDB Connection Error:');
    console.error(error);
    console.log(`⏱ Connection attempt duration before failure: ${seconds} seconds`);
    process.exit(1);
  }
};

// Extra connection listeners
mongoose.connection.on('connected', () => {
  console.log(`[${new Date().toLocaleTimeString()}] 🟢 Mongoose connected`);
});
mongoose.connection.on('disconnected', () => {
  console.log(`[${new Date().toLocaleTimeString()}] 🟡 Mongoose disconnected`);
});
mongoose.connection.on('reconnected', () => {
  console.log(`[${new Date().toLocaleTimeString()}] 🔄 Mongoose reconnected`);
});
mongoose.connection.on('error', (err) => {
  console.log(`[${new Date().toLocaleTimeString()}] ❌ Mongoose connection error:`, err);
});

module.exports = connectDB;
