import { ImageModel } from './entity/image.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { AwsService } from 'src/aws/aws.service';
export declare class ImageService {
    private readonly awsService;
    private readonly userService;
    private readonly imageRepository;
    constructor(awsService: AwsService, userService: UserService, imageRepository: Repository<ImageModel>);
    saveMetadata(email: string, key: string): Promise<ImageModel>;
}
