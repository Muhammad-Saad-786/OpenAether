// src/lib/security/encryption.js
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
  }

  async encrypt(text, key) {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  async decrypt(encryptedData, key) {
    const decipher = createDecipheriv(this.algorithm, key, Buffer.from(encryptedData.iv, 'hex'));

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
