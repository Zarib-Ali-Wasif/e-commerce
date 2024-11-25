import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  Body,
  Param,
  Get,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly cloudinaryService: ImageService) {}

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingleImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.cloudinaryService.uploadSingleImage(file);
  }

  @Get('fetch/:publicId')
  async fetchImage(@Query('publicId') publicId: string): Promise<string> {
    return this.cloudinaryService.fetchImage(publicId);
  }

  @Put('update/:publicId')
  @UseInterceptors(FileInterceptor('newImage'))
  async updateImage(
    @Param('publicId') publicId: string,
    @UploadedFile() newImage: Express.Multer.File,
  ): Promise<string> {
    return this.cloudinaryService.updateImage(publicId, newImage);
  }

  @Delete('delete/single/:publicId')
  async deleteSingleImage(@Param('publicId') publicId: string): Promise<any> {
    return this.cloudinaryService.deleteSingleImage(publicId);
  }

  @Get('extractPublicId')
  async extractPublicIdFromUrl(@Query('url') url: string): Promise<any> {
    return this.cloudinaryService.extractPublicIdFromUrl(url);
  }
}
