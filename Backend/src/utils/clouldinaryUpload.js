// backend/src/utils/clouldinaryUpload.js
// const cloudinary = require('cloudinary').v2;
import { v2 as cloudinary } from 'cloudinary';

const uploadToCloudinary = async (
    fileBuffer,
    mimetype,
    folder,
    existingPublicId = null
) => {
    const base64Image = `data:${mimetype};base64,${fileBuffer.toString(
        'base64'
    )}`;

    const uploadOptions = existingPublicId
        ? {
              public_id: existingPublicId,
              overwrite: true,
              resource_type: 'image',
          }
        : {
              folder: folder,
              resource_type: 'image',
          };

    try {
        const result = await cloudinary.uploader.upload(
            base64Image,
            uploadOptions
        );

        return {
            secure_url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) {
        throw new Error(
            'Public ID is required to delete an asset from Cloudinary.'
        );
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

export default {
    uploadToCloudinary,
    deleteFromCloudinary,
};
