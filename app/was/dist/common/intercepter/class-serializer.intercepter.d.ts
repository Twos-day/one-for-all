import { ExecutionContext, CallHandler, ClassSerializerInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class CustomClassSerializerInterceptor extends ClassSerializerInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
