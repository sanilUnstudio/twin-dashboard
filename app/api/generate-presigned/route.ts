// app/api/s3/generate-presigned-url/route.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS!,
    secretAccessKey: process.env.AWS_ACCESS_SECRET!,
  },
});

export async function POST(req: Request) {
  try {
    const { fileType } = await req.json();

    const folder = "training-products";
    const fileKey = `${folder}/${uuidv4()}.jpg`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return Response.json({ uploadUrl, key: fileKey });
  } catch (err) {
    console.error("Presigned URL error:", err);
    return new Response("Failed to generate presigned URL", { status: 500 });
  }
}
