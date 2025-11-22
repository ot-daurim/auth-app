import helmet from "helmet";
import cors from 'cors';
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import express from 'express';

import { env } from "../configs/env.js";
import router  from "../routes/router.js";

export function setupApp(app){
    app.set('trust proxy', 1);
    app.use(helmet());

    app.use(cors({
        origin: env.cors_origin,
        credentials: true
    }));

    app.use(morgan('dev'));

    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }))

    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/api', apiLimiter);

    app.use(router);

    // 404 - Если ничего не поймали выше 
    // app.all('*', (req, res, next) => {
    //     const err = new Error(`Route ${req.originalUrl} not found`);
    //     err.statusCode = 484;
    //     next(err);
    // });

    app.use((err, req, res, next) => {
        console.error(err);

        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal server error';

        res.status(statusCode).json({
            status: 'error',
            message,
        })
    })

}