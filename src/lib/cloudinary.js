import { v2 as cloudinary } from 'cloudinary';

// Validate environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required Cloudinary environment variables:', missingEnvVars);
  throw new Error(`Missing Cloudinary environment variables: ${missingEnvVars.join(', ')}`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  // Add timeout and retry configurations
  timeout: 60000, // 60 seconds
  // Remove upload_preset if not needed
});

// Test the connection on startup (only in development)
if (process.env.NODE_ENV === 'development') {
  cloudinary.api.ping()
    .then(() => console.log('Cloudinary connection successful'))
    .catch(err => console.error('Cloudinary connection failed:', err.message));
}

export default cloudinary;
