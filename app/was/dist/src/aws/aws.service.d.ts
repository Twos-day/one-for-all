import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
export declare class AwsService {
    private configService;
    s3Client: S3Client;
    constructor(configService: ConfigService);
    imageUploadToS3(file: Express.Multer.File): Promise<{
        path: string;
    }>;
    generatePresignedUrl(projectName: string, userId: number, fileName: string): Promise<string>;
}
