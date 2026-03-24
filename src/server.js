import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

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
  //ROUTES
  app.use('/contacts', contactsRouter);

  //404 HANDLER
  app.use(notFoundHandler);

  //ERROR HANDLER (ALWAYS AT THE END)
  app.use(errorHandler);

  return app;
};
