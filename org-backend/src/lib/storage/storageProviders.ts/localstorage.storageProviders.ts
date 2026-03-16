import { storageService } from "../storageService.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

export class LocalStorage implements storageService {

  async upload(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;

    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return `/uploads/${fileName}`;
  }

  async getDownloadUrl(fileUrl: string): Promise<string> {
    return `http://localhost:5000${fileUrl}`;
  }


  async streamFile(fileUrl: string) {
    const fileName = path.basename(fileUrl);
    const fullPath = path.join(process.cwd(), "uploads", fileName);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found at ${fullPath}`);
    }
    
    return fs.createReadStream(fullPath);
  }

}

