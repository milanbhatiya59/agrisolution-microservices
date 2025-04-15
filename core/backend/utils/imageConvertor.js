import fs from 'fs';
import path from 'path';

const encodeImage = imagePath => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const ext = path.extname(imagePath).toLowerCase();
    let mimeType = 'image/png';

    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.bmp') mimeType = 'image/bmp';
    else if (ext === '.webp') mimeType = 'image/webp';

    return { base64Image, mimeType };
  } catch (error) {
    console.error('Error reading image file:', error.message);
    return null;
  }
};

export { encodeImage };
