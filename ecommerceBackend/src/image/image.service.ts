import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v2 } from 'cloudinary';
@Injectable()
export class ImageService {
  async uploadSingleImage(file, public_id = ''): Promise<{ url: string }> {
    try {
      const imageUrl = await this.uploadImage(file, public_id);
      return { url: imageUrl };
    } catch (error) {
      throw error;
    }
  }
  uploadImage(image: Express.Multer.File, public_id = ''): Promise<string> {
    try {
      if (!image) throw new ForbiddenException('Credential Incorrect!');

      return new Promise((resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream(
          { folder: 'ShopEasy', public_id: public_id },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          },
        );
        uploadStream.end(image.buffer);
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error uploading image');
    }
  }

  async fetchImage(public_id: string): Promise<string> {
    try {
      const result = await v2.image('ShopEasy/' + public_id);
      return result;
    } catch (error) {
      console.error('Error fetching image:', error);
      throw new NotFoundException('Image not found');
    }
  }

  async deleteSingleImage(public_id: string): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        v2.uploader.destroy('ShopEasy/' + public_id, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new NotFoundException('Image not found');
    }
  }

  async updateImage(public_id: string, newImage): Promise<string> {
    try {
      await this.deleteSingleImage(public_id);

      const imageUrl = await this.uploadImage(newImage, public_id);
      return imageUrl;
    } catch (error) {
      console.error('Error updating image:', error);
      throw new InternalServerErrorException('Error updating image');
    }
  }

  async extractPublicIdFromUrl(url: string): Promise<any> {
    try {
      const regex = /\/ShopEasy\/([^\/]+)\.\w+$/;
      const match = url.match(regex);

      if (match && match[1]) {
        const publicId = match[1]; // Include folder name
        return { publicId: publicId };
      } else {
        throw new Error('Failed to extract public ID from the URL.');
      }
    } catch (error) {
      console.error('Error extracting public ID:', error);
      throw new InternalServerErrorException('Error extracting public ID');
    }
  }
}
