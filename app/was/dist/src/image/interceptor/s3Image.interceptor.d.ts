import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { RequestHandler } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/aws/aws.service';
import { ImageService } from '../image.service';
export declare class S3ImageInterceptor implements NestInterceptor {
    private readonly configService;
    private readonly awsService;
    private readonly imageService;
    constructor(configService: ConfigService, awsService: AwsService, imageService: ImageService);
    get uploader(): RequestHandler;
    upload(request: any, response: any): Promise<unknown>;
    intercept(context: ExecutionContext, next: CallHandler): Promise<import("rxjs").Observable<any>>;
}
