import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(payload) {
    return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpires });
}

export function signRefreshToken(payload) {
    return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpires });
}

export function verivyAccessToken(token) { 
    return jwt.verify(token, env.jwtAccessSecret);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, env.jwtRefreshSecret)
}

export function setAuthCookies(res, { accessToken, refreshToken }) {
    const common = { httpOnly: true, sameSite: 'lax', secure: env.nodeEnv === 'production' }
    res.cookie('access_token', accessToken, {...common, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', refreshToken, {...common, maxAge: 7 * 24 * 60 * 60 * 1000 })
}

export function clearAuthCookie(res) {
    res.clearCookie('access_token', { httpOnly: true, sameSite: 'lax' });
    res.clearCookie('access_token', { httpOnly: true, sameSite: 'lax' })
}