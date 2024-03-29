import {v2 as cloudinary} from 'cloudinary';
import config from './config.js';

const { cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret } = config;

cloudinary.config({ 
  cloud_name: cloudinaryCloudName, 
  api_key: cloudinaryApiKey, 
  api_secret: cloudinaryApiSecret 
});

export { cloudinary };