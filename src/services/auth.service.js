import bcrypt from 'bcrypt';
import { nanoid } from "nanoid";
import { User } from '../models/User.js';
import { Token } from '../models/Token.js';
import { env } from '../config/env.js';
import { randomTokenString, hashToken } from '../utils/crypto.js';
import { sendMail } from '../utils/mailer.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

function lockoutActive(user) {
    return user.lockUntil && user.lockUntil > new Date();
}

export const authService = {
    async register({ fullName, email, password, appUrl = env.appUrl }) {
        const exists = await User.findOne({ email });
        if(exists) {
            const err = new Error('Пользователь с такой почтой уже существует');
            err.status = 409; throw err;
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ fullName, email, password: hash });

        // email verification token
        const raw = randomTokenString();
        const token = await Token.create({
            userId: user._id,
            tokenHash: hashToken(raw),
            type:'email-verify',
            expiresAt: new Date(Date.now() + env.tokenExpiresEmailHours * 3600 * 1000)
        });

        const link = `${appUrl}/api/auth/verify-email?token=${raw}&id=${user._id}`;
        await sendMail({
            to: email,
            subject: `<p>Здравствуйте ${fullName}</p>
                <p>Подтвердите вашу почту: <a href="${link}">${link}</a></p>
            `
        });
        return { user };
    },
    
    async verifyEmail({ userId, rawToken}) {
        const t = await Token.findOne({ userId, type: 'email-verify' }).sort({ createdAt: -1 });
        if(!t || t.expiresAt < new Date()) {
            const err = new Error('Токет недействителен иди истек'); err.status = 400; throw err;
        }
        if(t.tokenHash != hashToken(rawToken)) {
            const err = new Error('Не верный токен'); err.status = 400; throw err;
            
        }
        await User.updateOne({ _id: userId }, { $set: {isEmailVerified: true } });
        await Token.deleteMany({ userId, type: 'email-verify' }); // Зачистка
        return { ok: true }
    },

    async login({ email, password }) {
        const user = await User.findOne({ email });
        if(!user) { const err = new Error('Неверная почта или пароль'); err.status=401; throw err; }

        if(lockoutActive(user)) {
            const err = new Error('Аккаунт временно заблокирован из-за большого колличтества не удачных попыток. Попробуйте позжею');
            err.status = 429; throw err;
        }

        const ok = await bcrypt.compare(password, user.password);
        if(!ok) {
            const inc = (user.failedLoginAttempts || 0) + 1;
            const updates = { failedLoginAttempts: inc };
            if(inc >= 5) { // Правило: 5 подрят - в блок на 15 минут
                updates.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
                updates.failedLoginAttempts = 0
            }
            await User.updateOne({ _id: user._id }, {$set: updates });
            const err = new Error('Неверная почта или пароль'); err.status=401; throw err;
        }
        // Успех: сбросить счетчики
        await User.updateOne({ _id: user._id }, {$set: { failedLoginAttempts: 0, lockUntil: null } });

        const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });
        const refreshRaw = nanoid(64);
        const refreshToken = signRefreshToken({ sub: user._id.toString(), jti: refreshRaw });

        await Token.create({
            userId: user._id,
            tokenHash: hashToken(refreshRaw),
            type: 'refresh',
            expiresAt: new Date(Date.now() + 7 + 24 * 3600 * 1000)
        });

        return { user, accessToken, refreshToken, refreshRaw }
    },

    async refresh({ refreshJwt }) {
        // в JWT храниться jti=raw; подпись проверяем секретом refresh
        let payload;
        try {payload = payload = (await import('jsonwebtoken')).default.verify(refreshJwt, env.jwtRefreshSecret); }
        catch  { const err = new Error('Неверный refresh токен'); err.status=401; throw err; }

        const { sub: userId, jti: raw } = payload;
        const rec = await Token.findOne({ userId, type: 'refresh', tokenHash: hashToken(raw), revokedAt: null });
        if(!rec || rec.expiresAt < new Date()) { const err = new Error('Refresh токен недействителен'); err.status=401; throw err; }
        
        // Регистрация: текущий помечаем как отозванный и создаем новый
        const newRaw = nanoid(64);
        const newRefreshJwt = sign
    }
}