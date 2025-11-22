import express from 'express';
import { env } from './configs/env.js';
import { setupApp } from './middlewares/setup-app.js';
import { connectDB } from './configs/db.js';

async function serverStart() {
    const app = express();
    setupApp(app);
    await connectDB()
    app.listen(env.port, () => {
        console.log(
            `Server running http://localhost:${env.port}`
        )
    });
    
}
serverStart()