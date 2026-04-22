import express from 'express';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { validateConfig } from './src/config/validateEnv.js';

let bootstrapPromise = null;

const ensureBootstrap = async () => {
    if (!bootstrapPromise) {
        bootstrapPromise = (async () => {
            validateConfig();
            await connectDB();
        })().catch((error) => {
            bootstrapPromise = null;
            throw error;
        });
    }

    return bootstrapPromise;
};

const vercelApp = express();

vercelApp.use(async (_req, _res, next) => {
    try {
        await ensureBootstrap();
        next();
    } catch (error) {
        next(error);
    }
});

vercelApp.use(app);

export default vercelApp;
