import { supabase } from "../../../config/supabase.config.js";
import { v4 as uuidv4 } from "uuid";
import { storageService } from "../storageService.js";
import { Readable } from "stream";

export class SupabaseStorage implements storageService {

  async upload(file: Express.Multer.File): Promise<string> {
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("Resumes")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

     if (error) {
    console.error(" Supabase upload error:", error);
    throw new Error(error.message);
  }

    const { data } = supabase.storage
      .from("Resumes")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async getDownloadUrl(fileUrl: string): Promise<string> {
    const fileName = fileUrl.split("/").pop();

    const { data, error } = await supabase.storage
      .from("Resumes")
      .createSignedUrl(fileName!, 60);

    if (error) throw error;

    return data.signedUrl;
  }

  async streamFile(fileUrl: string) {
    const fileName = fileUrl.split("/").pop();
    if (!fileName) throw new Error("Invalid file URL");

    const { data, error } = await supabase.storage
      .from("Resumes")
      .download(fileName);

    if (error) {
      console.error("Supabase download error:", error);
      throw new Error(`Supabase download failed: ${error.message}`);
    }

    if (!data) {
      throw new Error("File not found in Supabase storage");
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    return Readable.from(buffer);
  }
}