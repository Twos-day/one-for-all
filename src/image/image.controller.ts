import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { DiskImageInterceptor } from './interceptor/diskImage.interceptor';
import { S3ImageInterceptor } from './interceptor/s3Image.interceptor';
import { AccessTokenGuard } from 'src/auth/guard/bear-token.guard';
import { AwsService } from 'src/aws/aws.service';
import { User } from 'src/users/decorator/user.decorator';
import { ConfigService } from '@nestjs/config';
import { LogService } from 'src/log/log.service';

@UseGuards(AccessTokenGuard)
@Controller('image')
export class ImageController {
  constructor(
    private readonly awsService: AwsService,
    private readonly imageService: ImageService,
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {}

  // @Post('local')
  // @UseInterceptors(DiskImageInterceptor)
  // saveLocal(@UploadedFile() file: Express.Multer.File) {
  //   return { file: file.filename };
  // }

  // @Post('s3')
  // @UseInterceptors(S3ImageInterceptor)
  // saveS3(@UploadedFile() file: Express.MulterS3.File) {
  //   return { file: file.key };
  // }

  @Post('sign')
  async postPresignedUrl(
    @User('id') userId: number,
    @User('email') email: string,
    @Body('projectName') projectName: string,
    @Body('fileName') fileName: string,
  ) {
    const url = await this.awsService.generatePresignedUrl(
      projectName,
      userId,
      fileName,
    );

    const log = `사용자 ${email}에게 ${projectName} 프로젝트의 사진 업로드 URL 발급`;

    Logger.log(log);
    this.logService.sendDiscode(log);

    return { url };
  }
}
