import { AwsService } from './aws.service';
export declare class AwsController {
    private readonly awsService;
    constructor(awsService: AwsService);
    uploadImage(file: Express.Multer.File): Promise<{
        path: string;
    }>;
}
