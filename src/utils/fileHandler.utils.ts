import * as crypto from 'crypto';

export const generateFileHash = (fileBuffer: Buffer): string => {
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
};
