import { StorageProvider } from './types';
import { LocalStorageProvider } from './local-provider';
import { SupabaseStorageProvider } from './supabase-provider';

let storageInstance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (storageInstance) return storageInstance;

  const providerType = process.env.STORAGE_PROVIDER?.toLowerCase();

  if (providerType === 'supabase') {
    try {
      storageInstance = new SupabaseStorageProvider();
      return storageInstance;
    } catch (err) {
      console.warn('Falling back to LocalStorageProvider due to Supabase setup error:', err);
      storageInstance = new LocalStorageProvider();
      return storageInstance;
    }
  }

  // Default to local storage provider
  storageInstance = new LocalStorageProvider();
  return storageInstance;
}

export const storage = getStorageProvider();
export type { StorageProvider, StorageUploadOptions } from './types';
