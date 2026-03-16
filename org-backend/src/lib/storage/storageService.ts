export interface storageService {
  upload(file: Express.Multer.File): Promise<string>;
  getDownloadUrl(fileUrl: string): Promise<string>;
  streamFile(path: string): Promise<NodeJS.ReadableStream>;
}