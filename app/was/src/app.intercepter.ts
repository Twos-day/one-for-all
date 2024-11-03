import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** 응답을 보내기전에 가공해서 보냄 **/
@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        ...data,
        message: Array.isArray(data.message)
          ? data.message
          : [data?.message || '요청이 성공적으로 처리되었습니다.'],
      })),
    );
  }
}
