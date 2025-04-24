import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB);
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;