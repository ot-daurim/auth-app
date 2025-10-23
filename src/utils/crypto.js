import crypto, { randomBytes } from 'crypto';

export function randomTokenString(bytes = 32) {
    return randomBytes(bytes).toString('hex');
}

export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}