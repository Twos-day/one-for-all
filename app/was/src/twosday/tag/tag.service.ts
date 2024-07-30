import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { TwosdayTagModel } from './entity/tag.entity';

@Injectable()
export class TwosdayTagService {
  constructor(
    @InjectRepository(TwosdayTagModel)
    private readonly postsRepository: Repository<TwosdayTagModel>,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) {}

  async getTags() {
    const tagModels = await this.postsRepository.find({
      order: { name: 'ASC' },
      select: ['id', 'name'],
    });
    return tagModels;
  }

  async postTag(tag: string) {
    try {
      const tagModel = this.postsRepository.create({
        name: tag,
      });
      const newTag = await this.postsRepository.save(tagModel);
      return newTag;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 태그입니다.');
      }
    }
  }

  async patchTag(id: number, tag: string) {
    try {
      const result = await this.postsRepository.update({ id }, { name: tag });
      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 태그입니다.');
      }
    }
  }

  async deleteTag(id: number) {
    const result = await this.postsRepository.delete({ id });
    return result;
  }
}
