import cloudinary from './cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function uploadNinImage(imageFile, bookingId) {
  try {
    // First try Cloudinary
    return await uploadToCloudinary(imageFile);
  } catch (cloudinaryError) {
    console.error('Cloudinary upload failed, trying local storage:', cloudinaryError.message);
    
    // Fallback to local storage in production
    if (process.env.NODE_ENV === 'production') {
      return await uploadToLocal(imageFile, bookingId);
    }
    
    throw cloudinaryError;
  }
}

async function uploadToCloudinary(imageFile) {
  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64String = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64String,
      {
        folder: "saphire-apartments/nin-documents",
        resource_type: "image",
        transformation: [
          { quality: "auto:good", width: 1000, height: 1000, crop: "limit" },
          { fetch_format: "auto" }
        ],
        timeout: 60000,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            provider: 'cloudinary'
          });
        }
      }
    );
  });
}

async function uploadToLocal(imageFile, bookingId) {
  try {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'nin-documents');
    await mkdir(uploadDir, { recursive: true });
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `nin-${bookingId}-${timestamp}.${imageFile.type.split('/')[1]}`;
    const filepath = path.join(uploadDir, filename);
    
    // Write file
    await writeFile(filepath, buffer);
    
    // Return URL format similar to Cloudinary
    return {
      url: `/uploads/nin-documents/${filename}`,
      publicId: filename,
      provider: 'local'
    };
  } catch (error) {
    console.error('Local upload failed:', error);
    throw error;
  }
}
