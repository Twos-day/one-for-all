import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`);

    // 응답이 완료된 후 실행되는 콜백 함수 등록
    res.on('finish', () => {
      console.log(`Response Status: ${res.statusCode}`);
      console.log(`Response Headers: ${JSON.stringify(res.getHeaders())}`);
    });

    next();
  }
}
