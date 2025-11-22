import mongoose from "mongoose";
import { env } from "./env.js";
export async function connectDB() {
    try {
        await mongoose.connect(env.mongo_url);
        console.log('Connected to MongoDB!')
    } catch (err) {
        console.error('Field to connect MongoDB:', err.message)
    }
}