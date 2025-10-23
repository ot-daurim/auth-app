import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenHash: { type: String, required: true } ,// Хранится хэш токена
    type: { type: String, enum: [ 'email-verify', 'password-reset', 'refresh' ], required: true },
    expiresAt: { type: Date, required: true },

    // Для ротации refresh
    revokedAt: { type: Date, default: null },
    replaceBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Token', default: null }
}, { timestamps: true });


tokenSchema.index({ userId: 1, default: null });
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TLL

export const Token = mongoose.model('Token', tokenSchema)