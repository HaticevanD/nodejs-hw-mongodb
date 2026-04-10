import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

export const saveFileToUploadDir = async (file) => {
  // 1. Dosyanın şu anki (geçici) yerini ve hedef (kalıcı) yerini belirliyoruz
  const tempPath = path.join(TEMP_UPLOAD_DIR, file.filename);
  const finalPath = path.join(UPLOAD_DIR, file.filename);

  // 2. Dosyayı temp klasöründen uploads klasörüne taşıyoruz
  await fs.rename(tempPath, finalPath);

  // 3. İstemcinin bu dosyaya tarayıcıdan erişebilmesi için URL oluşturuyoruz
  // Örn: http://localhost:3000/uploads/resim-adi.jpg
  const PORT = env('PORT', '3000');
  const APP_DOMAIN = env('APP_DOMAIN'); // Eğer domain tanımlıysa onu kullanır

  return `${APP_DOMAIN || `http://localhost:${PORT}`}/uploads/${file.filename}`;
};
