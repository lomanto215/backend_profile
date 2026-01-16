import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'portfolio',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('Upload failed: no result'));
            resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const urlParts = imageUrl.split('/');
    const publicIdWithExt = urlParts[urlParts.length - 1];
    const publicId = `portfolio/${publicIdWithExt.split('.')[0]}`;

    await cloudinary.uploader.destroy(publicId);
  }
}