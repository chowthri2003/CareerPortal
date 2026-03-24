import { SupabaseStorage } from "./storageProviders.ts/supabase.storageProvider.js";
import { storageService } from "./storageService.js";
import { LocalStorage } from "./storageProviders.ts/localstorage.storageProviders.js";

/**
 * Use when UPLOADING new files
 * Provider comes from .env
 */
export function getStorageProvider(): storageService {
  const provider = process.env.STORAGE_PROVIDER;

  console.log("STORAGE_PROVIDER:", provider);

  switch (provider) {
    case "supabase":
      return new SupabaseStorage();

    case "local":
      return new LocalStorage();

    default:
      throw new Error("Invalid storage provider");
  }
}

/**
 * Use when DOWNLOADING existing files
 * Provider comes from database
 */
export function getStorageByName(provider: string): storageService {
  switch (provider) {
    case "supabase":
      return new SupabaseStorage();

    case "local":
      return new LocalStorage();

    default:
      throw new Error("Invalid storage provider");
  }
}