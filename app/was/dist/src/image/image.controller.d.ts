import { ImageService } from './image.service';
import { AwsService } from 'src/aws/aws.service';
import { ConfigService } from '@nestjs/config';
import { LogService } from 'src/log/log.service';
export declare class ImageController {
    private readonly awsService;
    private readonly imageService;
    private readonly configService;
    private readonly logService;
    constructor(awsService: AwsService, imageService: ImageService, configService: ConfigService, logService: LogService);
    postPresignedUrl(userId: number, email: string, projectName: string, fileName: string): Promise<{
        url: string;
    }>;
}
