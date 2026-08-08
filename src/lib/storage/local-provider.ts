import fs from 'fs/promises';
import path from 'path';
import { StorageProvider, StorageUploadOptions } from './types';

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async uploadFile(file: Buffer | Uint8Array, options?: StorageUploadOptions): Promise<string> {
    const folder = options?.folder || 'general';
    const ext = options?.contentType?.split('/')[1] || 'png';
    const filename = options?.filename || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    
    const targetFolder = path.join(/*turbopackIgnore: true*/ this.uploadDir, folder);
    await this.ensureDirectoryExists(targetFolder);

    const filePath = path.join(/*turbopackIgnore: true*/ targetFolder, filename);
    await fs.writeFile(filePath, Buffer.from(file));

    return `/uploads/${folder}/${filename}`;
  }

  async deleteFile(fileUrlOrPath: string): Promise<void> {
    if (!fileUrlOrPath.startsWith('/uploads/')) return;
    
    const relativePath = fileUrlOrPath.replace('/uploads/', '');
    const fullPath = path.join(this.uploadDir, relativePath);

    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.warn(`Local file deletion failed for ${fullPath}:`, error);
    }
  }

  getFileUrl(relativePath: string): string {
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    return relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  }
}
