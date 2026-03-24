import { storageService } from "../storageService.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";//for handling file paths
import fs from "fs";//for create folders, write files, read streams

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
    return `http://localhost:4000${fileUrl}`;
  }


  async streamFile(fileUrl: string) {
    const fileName = path.basename(fileUrl);
    const fullPath = path.join(process.cwd(), "uploads", fileName);//process.cwd() → current project root
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found at ${fullPath}`);
    }
    
    return fs.createReadStream(fullPath);
  }

}

