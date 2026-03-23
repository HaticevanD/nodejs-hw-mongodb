import { setupServer } from './server.js';
import { env } from './utils/env.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const bootstrap = () => {
  const app = setupServer();
  const PORT = Number(env('PORT', '3000'));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
initMongoConnection();
