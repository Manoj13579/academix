import mongoose from 'mongoose';
import 'dotenv/config';

const connectDb = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI!);
        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`) 
    } catch (error) {
     console.error(`Error in DB Connection: ${error}`);
        process.exit(1)
    }
};

export default connectDb;