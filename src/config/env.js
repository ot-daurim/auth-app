import dotenv from 'dotenv';
dotenv.config();


export const env = {
    port: process.env.PORT || 9090,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/auth-app',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES,
    jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES,
    smtpPass: process.env.SMTP_PASS,
    smtpHost: process.env.SMTP_HOST,
    smtpUser: process.env.SMTP_USER,
    smtpPort: process.env.SMTP_PORT,
    smtpFrom: process.env.SMTP_FROM,
    tokenExpiresEmailHours: process.env.TOKEN_EXPIRES_EMAIL_HOURS,
    tokenExpiresResetHours: process.env.TOKEN_EXPIRES_RESET_HOURS
}