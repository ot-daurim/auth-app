import dotenv from 'dotenv';
dotenv.config();

export const env = {
    port: process.env.PORT || 9090,
    mongo_url: process.env.MONGO_URL || 'mongodb://localhost:27017/auth-app',
    cors_origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}