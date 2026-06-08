import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let connectPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectPromise) {
    return connectPromise;
  }

  try {
    connectPromise = mongoose.connect(process.env.MONGODB_URI);
    await connectPromise;
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    connectPromise = null;
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

export default connectDB;
