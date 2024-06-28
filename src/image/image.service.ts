import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageModel } from './entity/image.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  async saveMetadata(id: number, key: string) {
    const user = await this.userService.getUserById(id);
    const image = this.imageRepository.create({ user, key });
    return await this.imageRepository.save(image);
  }
}
