import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { validateConfig } from '../src/config/validateEnv.js';

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

export default async function handler(req, res) {
    await ensureBootstrap();
    return app(req, res);
}
