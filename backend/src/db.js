import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';

dotenv.config();
const router = express.Router();

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI is not set');
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}

export { connectDB, router };