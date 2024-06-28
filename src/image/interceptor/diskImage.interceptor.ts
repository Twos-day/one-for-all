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
import { extname } from 'path';
import { tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { POSTS_FOLDER_PATH } from '../const/path.const';
import { InjectRepository } from '@nestjs/typeorm';

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
  storage: multer.diskStorage({
    destination: (req, res, cb) => {
      console.log(POSTS_FOLDER_PATH);
      return cb(null, POSTS_FOLDER_PATH);
    },
    filename: (req, file, cb) => {
      cb(null, uuid() + extname(file.originalname));
    },
  }),
};

@Injectable()
export class DiskImageInterceptor implements NestInterceptor {
  constructor() {}

  get uploader(): RequestHandler {
    return multer(multerOptions).single('image');
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

    if (!request.file) {
      throw new BadRequestException('이미지 파일이 없습니다.');
    }

    return next
      .handle()
      .pipe(
        tap(() => Logger.log('DiskImageInterceptor: 로컬 이미지 저장성공')),
      );
  }
}
