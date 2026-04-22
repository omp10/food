import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let connectionPromise = null;

export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        if (!connectionPromise) {
            connectionPromise = mongoose.connect(config.mongodbUri);
        }

        const conn = await connectionPromise;
        logger.info(`MongoDB connected: ${conn.connection.host}`);
        connectionPromise = null;
        return conn;
    } catch (error) {
        connectionPromise = null;
        logger.error(`MongoDB connection error: ${error.message}`);
        throw error;
    }
};

/**
 * Close MongoDB connection (e.g. graceful shutdown).
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
};
