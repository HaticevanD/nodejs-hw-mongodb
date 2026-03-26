import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

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

  app.get('/', (req, res) => {
    res.send('Contacts API is running');
  });
  //ROUTES
  app.use('/contacts', contactsRouter);

  //404 HANDLER
  app.use(notFoundHandler);

  //ERROR HANDLER (ALWAYS AT THE END)
  app.use(errorHandler);

  return app;
};
