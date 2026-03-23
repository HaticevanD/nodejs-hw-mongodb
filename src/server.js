import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import dotenv from 'dotenv';
import contactsRouter from './routes/contacts.js';

dotenv.config();

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use('/contacts', contactsRouter);
  app.get('/{*splat}', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
  return app;
};
