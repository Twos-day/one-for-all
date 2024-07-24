import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { RequestHandler } from '@nestjs/common/interfaces';
export declare class DiskImageInterceptor implements NestInterceptor {
    constructor();
    get uploader(): RequestHandler;
    upload(request: any, response: any): Promise<unknown>;
    intercept(context: ExecutionContext, next: CallHandler): Promise<import("rxjs").Observable<any>>;
}
