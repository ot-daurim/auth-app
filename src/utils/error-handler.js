import { logger } from './logger.js';

export function errorHandler(err, req, res, _nex) {
    const status = err.status || 500;
    const code = err.code || 'INTERNAL_ERROR';

    if(status >= 500) logger.error({ err }, 'Internal error');
    else logger.warn({ err }, 'Handler error');

    res.status(status).json({
        ok: false,
        error: err.message || 'Server error',
        code
    });
}

export function notFoundHandler(_req, _res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    next(err);
}