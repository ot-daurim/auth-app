import helmet from "helmet";
import morgan from "morgan";

import { env } from "../config/env.js";

import cookieParser from "cookie-parser";
import express from 'express';
import cors from 'cors';
import rateLimit from "express-rate-limit";


export default function setupApp(app) {
    app.set('trust proxy', 1);

    app.use(helmet());
    if(env.nodeEnv = 'development') app.use(morgan('dev'));

    app.use(cookieParser());
    app.use(express.json({ limit: '1mb' }));

    app.use(cors({
        origin: env.cors_origin,
        credentials: true
    }));

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use('/api/', limiter)
}