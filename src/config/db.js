import mongoose from "mongoose";
import { env } from "./env.js";

export default async function connectDB() {
    try {
        await mongoose.connect(env.mongoUri);
        console.log('Connected to MongoDB!')
    } catch(err) {
        console.error('MongoDB connecting error:', err.message)
        process.exit(1)
    }
}