import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, 

    // Email верификация 
    isEmailVerified: { type: Boolean, default: false },

    // Защита от брутфорса
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null }
}, { timestamps: true })


userSchema.index({ email: 1 }, { unique: true });
export const User = mongoose.model('User', userSchema)