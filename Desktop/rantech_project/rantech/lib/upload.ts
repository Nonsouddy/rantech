import fs from "fs";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function saveUploadedImage(
  file: File,
  subfolder: "projects" | "hero"
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, WEBP or AVIF images are allowed.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be smaller than 8MB.");
  }

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads", subfolder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, filename), bytes);

  return `/uploads/${subfolder}/${filename}`;
}

export function deleteUploadedImage(imagePath: string): void {
  // Only delete files we actually manage — ignore external/placeholder URLs.
  if (!imagePath.startsWith("/uploads/")) return;
  const fullPath = path.join(process.cwd(), "public", imagePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}