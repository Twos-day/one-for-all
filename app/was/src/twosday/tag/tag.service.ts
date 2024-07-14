import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { In, Repository } from 'typeorm';
import { TwosdayTagModel } from './entity/tag.entity';

@Injectable()
export class TwosdayTagService {
  constructor(
    @InjectRepository(TwosdayTagModel)
    private readonly postsRepository: Repository<TwosdayTagModel>,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) {}

  async postTag(tag: string) {
    const tagModel = this.postsRepository.create({
      name: tag,
    });
    const newTag = await this.postsRepository.save(tagModel);
    return newTag;
  }

  async getTags(tags: string[]) {
    const tagModels = await this.postsRepository.find({
      where: { name: In(tags) },
    });
    return tagModels;
  }
}
