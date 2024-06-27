import { S3Client } from '@aws-sdk/client-s3';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { RequestHandler } from '@nestjs/common/interfaces';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { extname } from 'path';
import { tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3ImageInterceptor implements NestInterceptor {
  private readonly uploader: RequestHandler;

  constructor() {
    const multerOptions: multer.Options = {
      limits: {
        fieldSize: 10000000, //바이트 단위로 입력
      },
      fileFilter: (req, file, cb) => {
        // cb(에러, 저장여부/boolean)
        const ext = extname(file.originalname); //확장자 추출
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'),
          );
        }

        return cb(null, true);
      },
      storage: multerS3({
        s3: new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY,
          },
        }),
        bucket: process.env.AWS_S3_BUCKET_NAME,
        key: function (request, file, cb) {
          const fileName = uuid() + extname(file.originalname);
          cb(null, fileName);
        },
      }),
    };

    this.uploader = multer(multerOptions).single('image');
  }

  upload(request: any, response: any) {
    return new Promise((resolve, reject) => {
      this.uploader(request, response, (error: Error) => {
        return error ? reject(error) : resolve(request);
      });
    });
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    await this.upload(request, response);

    return next
      .handle()
      .pipe(
        tap(() => Logger.log('S3ImageInterceptor: S3-Bucket 이미지 저장성공')),
      );
  }
}
