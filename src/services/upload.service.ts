import { mkdir, writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
const AVATAR_DIR = path.join(UPLOAD_DIR, "avatars");
const PUBLIC_URL_PREFIX = "/uploads/avatars";

/** Ensure upload directories exist */
async function ensureDirs() {
  if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });
  if (!existsSync(AVATAR_DIR)) await mkdir(AVATAR_DIR, { recursive: true });
}

/** Allowed image MIME types */
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export interface UploadResult {
  url: string;
  filename: string;
}

export class UploadService {
  /**
   * Save an avatar image for a user.
   * @param userId - The user's UUID
   * @param file - The uploaded file buffer
   * @param mimetype - The file MIME type
   * @param originalName - Original filename (used for extension)
   */
  static async saveAvatar(
    userId: string,
    file: Buffer,
    mimetype: string,
    originalName: string
  ): Promise<UploadResult> {
    await ensureDirs();

    if (!ALLOWED_TYPES.includes(mimetype)) {
      throw new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`);
    }

    if (file.length > MAX_FILE_SIZE) {
      throw new Error(`File too large. Max size: ${MAX_FILE_SIZE / (1024 * 1024)} MB`);
    }

    // Determine extension from mimetype
    const extMap: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
    };
    const ext = extMap[mimetype] || path.extname(originalName) || ".jpg";

    // Create filename: userId-timestamp.ext
    const filename = `${userId}-${Date.now()}${ext}`;
    const filepath = path.join(AVATAR_DIR, filename);

    await writeFile(filepath, file);

    return {
      url: `${PUBLIC_URL_PREFIX}/${filename}`,
      filename,
    };
  }

  /**
   * Delete an avatar file by its URL.
   */
  static async deleteAvatarByUrl(url: string): Promise<void> {
    if (!url) return;
    const filename = url.split("/").pop();
    if (!filename) return;

    const filepath = path.join(AVATAR_DIR, filename);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }
  }

  /**
   * Get the upload directory path (for static file serving).
   */
  static getUploadDir(): string {
    return UPLOAD_DIR;
  }

  static getAvatarDir(): string {
    return AVATAR_DIR;
  }
}
