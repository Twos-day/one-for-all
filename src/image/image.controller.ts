import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { DiskImageInterceptor } from './interceptor/diskImage.interceptor';
import { S3ImageInterceptor } from './interceptor/s3Image.interCeptor';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('local')
  @UseInterceptors(DiskImageInterceptor)
  saveLocal(@UploadedFile() file: Express.Multer.File) {
    return { file: file.filename };
  }

  @Post('s3')
  @UseInterceptors(S3ImageInterceptor)
  saveS3(@UploadedFile() file: Express.MulterS3.File) {
    return { file: file.key };
  }
}
