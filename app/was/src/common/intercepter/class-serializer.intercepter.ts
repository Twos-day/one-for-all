import {
  Injectable,
  ExecutionContext,
  CallHandler,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as operators_1 from 'rxjs/operators';

const PASS_THROUGH = ['/login'];

@Injectable()
export class CustomClassSerializerInterceptor extends ClassSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextOptions = this.getContextOptions(context);
    const options = {
      ...this.defaultOptions,
      ...contextOptions,
    };
    const req = context.switchToHttp().getRequest();
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // const res: Response = context.switchToHttp().getResponse();

    // Request
    const pathname = req.originalUrl;
    req.fullUrl = fullUrl;

    return next.handle().pipe(
      (0, operators_1.map)((res) => {
        // Response
        if (PASS_THROUGH.includes(pathname)) return res;
        return this.serialize(res, options);
      }),
    );
  }
}
