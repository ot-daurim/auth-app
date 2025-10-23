import express from 'express';
import { env } from './config/env.js';
import router from './routes/router.js';
import connectDB from './config/db.js';
import setupApp from './middlewares/setup-app.js';

async function startServer() {
    const app = express();
    await connectDB();

    setupApp(app);

    app.use(router);
    app.listen(env.port, () => {
        console.log(`Server started on port => http://localhost:${env.port}`);
    });
}
startServer()