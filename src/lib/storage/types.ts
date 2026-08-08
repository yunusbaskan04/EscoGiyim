export interface StorageUploadOptions {
  folder?: string;
  filename?: string;
  contentType?: string;
}

export interface StorageProvider {
  /**
   * Uploads a buffer or file to storage and returns the publicly accessible URL.
   */
  uploadFile(file: Buffer | Uint8Array, options?: StorageUploadOptions): Promise<string>;

  /**
   * Deletes a file from storage using its public URL or path.
   */
  deleteFile(fileUrlOrPath: string): Promise<void>;

  /**
   * Gets the public URL for a stored file.
   */
  getFileUrl(path: string): string;
}
