import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

export const saveFileToUploadDir = async (file) => {
  // 1.Temporary and Final directory of the file
  const tempPath = path.join(TEMP_UPLOAD_DIR, file.filename);
  const finalPath = path.join(UPLOAD_DIR, file.filename);

  // 2. Carry the file from temp to uploads
  await fs.rename(tempPath, finalPath);

  // 3. Create URL so that the client can access to this file from browser
  // Ex: http://localhost:3000/uploads/photo-name.jpg
  const PORT = env('PORT', '3000');
  const APP_DOMAIN = env('APP_DOMAIN'); // Use domain if defined

  return `${APP_DOMAIN || `http://localhost:${PORT}`}/uploads/${file.filename}`;
};
