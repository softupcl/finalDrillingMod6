import { access } from 'fs/promises';

export const fileExists = async(filePath) => {
    try {
      await access(filePath);
      console.log(`El archivo "${filePath}" existe.`);
      return true;
    } catch {
      console.log(`El archivo "${filePath}" no existe.`);
      return false;
    }
  }