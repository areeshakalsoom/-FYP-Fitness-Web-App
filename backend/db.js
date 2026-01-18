// test-mongo.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function test() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas!');
  } catch (err) {
    console.error('❌ MongoDB Atlas connection failed:', err);
  } finally {
    await client.close();
  }
}

test();
