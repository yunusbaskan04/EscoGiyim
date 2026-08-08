import { createClient } from '@supabase/supabase-js';
import { StorageProvider, StorageUploadOptions } from './types';

export class SupabaseStorageProvider implements StorageProvider {
  private supabaseUrl: string;
  private supabaseKey: string;
  private bucket: string;

  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    this.bucket = process.env.SUPABASE_BUCKET || 'esco-giyim-assets';
  }

  private getClient() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Supabase Storage environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are missing.');
    }
    return createClient(this.supabaseUrl, this.supabaseKey);
  }

  async uploadFile(file: Buffer | Uint8Array, options?: StorageUploadOptions): Promise<string> {
    const client = this.getClient();
    const folder = options?.folder || 'general';
    const ext = options?.contentType?.split('/')[1] || 'png';
    const filename = options?.filename || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `${folder}/${filename}`;

    let { error } = await client.storage
      .from(this.bucket)
      .upload(filePath, file, {
        contentType: options?.contentType || 'image/png',
        upsert: true,
      });

    if (error && error.message?.toLowerCase().includes('bucket not found')) {
      console.log(`Bucket ${this.bucket} not found. Attempting auto-creation...`);
      await client.storage.createBucket(this.bucket, { public: true });
      const retry = await client.storage
        .from(this.bucket)
        .upload(filePath, file, {
          contentType: options?.contentType || 'image/png',
          upsert: true,
        });
      error = retry.error;
    }

    if (error) {
      throw new Error(`Supabase storage upload error: ${error.message}`);
    }

    const { data: publicUrlData } = client.storage
      .from(this.bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  async deleteFile(fileUrlOrPath: string): Promise<void> {
    const client = this.getClient();
    let filePath = fileUrlOrPath;

    if (fileUrlOrPath.includes(this.bucket)) {
      filePath = fileUrlOrPath.split(`${this.bucket}/`)[1] || fileUrlOrPath;
    }

    const { error } = await client.storage.from(this.bucket).remove([filePath]);
    if (error) {
      console.warn(`Supabase storage delete error for ${filePath}:`, error.message);
    }
  }

  getFileUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const client = this.getClient();
    const { data } = client.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
