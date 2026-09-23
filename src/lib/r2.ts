import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export interface CloudflareR2Config {
  accountId: string;
  bucketName: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicUrl: string;
}

export const DEFAULT_R2_CONFIG: CloudflareR2Config = {
  accountId:
    import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "a7d64e57350dbbddcc2b65f7d8ede3a0",
  bucketName:
    import.meta.env.VITE_CLOUDFLARE_BUCKET_NAME || "imagenesoverplay",
  accessKeyId:
    import.meta.env.VITE_CLOUDFLARE_ACCESS_KEY_ID || "cbce2ec53f08bc186b64d463df8325f0",
  secretAccessKey:
    import.meta.env.VITE_CLOUDFLARE_SECRET_ACCESS_KEY ||
    "aaf8802d017d1da21588dc44e4bb886e5ed1cfddad234900faa874fe1ff0e780",
  publicUrl:
    import.meta.env.VITE_CLOUDFLARE_PUBLIC_URL ||
    "https://pub-def6d9ceb4ef4e8f84ee8a391d2b0b27.r2.dev",
};

/**
 * Sube un archivo a Cloudflare R2 y retorna la URL pública del CDN
 */
export async function uploadFileToR2(
  file: File,
  folder: string = "registrations",
  onProgress?: (fileName: string) => void
): Promise<string> {
  const accountId = DEFAULT_R2_CONFIG.accountId.trim();
  const bucketName = DEFAULT_R2_CONFIG.bucketName.trim();
  const accessKeyId = DEFAULT_R2_CONFIG.accessKeyId.trim();
  const secretAccessKey = DEFAULT_R2_CONFIG.secretAccessKey.trim();
  const publicUrl = DEFAULT_R2_CONFIG.publicUrl.trim().replace(/\/$/, "");

  if (onProgress) onProgress(file.name);

  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .toLowerCase();
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const uniqueKey = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${cleanBaseName}.${ext}`;

  const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const fileBytes = new Uint8Array(await file.arrayBuffer());

  const uploadCmd = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueKey,
    Body: fileBytes,
    ContentType: file.type || (ext === "pdf" ? "application/pdf" : "image/jpeg"),
  });

  await s3Client.send(uploadCmd);

  return `${publicUrl}/${uniqueKey}`;
}

/**
 * Sube múltiples archivos (hasta 5) de carrera/perfil a R2
 */
export async function uploadMultipleFilesToR2(
  files: File[],
  folder: string = "registrations",
  onProgress?: (current: number, total: number, fileName: string) => void
): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (onProgress) {
      onProgress(i + 1, files.length, file.name);
    }
    const url = await uploadFileToR2(file, folder);
    uploadedUrls.push(url);
  }

  return uploadedUrls;
}
