import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
 
export async function uploadThumbnail(buffer, fileName) {
  // if AWS_ENDPOINT_URL_S3 exists, we're on my laptop with LocalStack running
  const usingLocalStack = !!process.env.AWS_ENDPOINT_URL_S3;
 
  if (usingLocalStack) {
    // ---- path 1: local dev, upload to LocalStack (fake S3) ----
    const s3 = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
      },
    });
 
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: "image/png",
      })
    );
 
    return `${process.env.AWS_ENDPOINT_URL_S3}/${process.env.AWS_S3_BUCKET}/${fileName}`;
  } else {
    // ---- path 2: deployed (no AWS available), upload to Supabase Storage ----
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
 
    const { error } = await supabaseAdmin.storage
      .from("thumbnails") // make this bucket in Supabase dashboard first
      .upload(fileName, buffer, { contentType: "image/png", upsert: true });
 
    if (error) throw new Error(error.message);
 
    // get the public URL for the file we just uploaded
    const { data } = supabaseAdmin.storage.from("thumbnails").getPublicUrl(fileName);
    return data.publicUrl;
  }
}
 