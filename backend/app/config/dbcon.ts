import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const DatabaseConnection = async (): Promise<void> => {
    if (!MONGO_URL) {
        throw new Error("MONGO_URL is not defined in environment variables");
    }

    try {
        await mongoose.connect(MONGO_URL);
        console.log("------------------------------------------");
        console.log("DATABASE: Connected Successfully");
        console.log("------------------------------------------");
    } catch (error) {
        console.error("DATABASE: Connection Failed");
        throw error;
    }
}

export default DatabaseConnection;

