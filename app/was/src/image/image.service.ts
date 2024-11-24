import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageModel } from './entity/image.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly awsService: AwsService,
    private readonly userService: UserService,
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  async saveMetadata(email: string, key: string) {
    const user = await this.userService.getUserByEmail(email);
    const image = this.imageRepository.create({ user, key });
    return await this.imageRepository.save(image);
  }

  async saveImageUrl({ key, userId }: { userId: number; key: string }) {
    const existImage = await this.imageRepository.findOne({ where: { key } });

    if (!existImage) {
      const newImage = this.imageRepository.create({
        user: { id: userId },
        key,
      });

      return this.imageRepository.save(newImage);
    }

    return existImage;
  }
}
