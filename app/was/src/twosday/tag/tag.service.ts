import { Injectable } from '@nestjs/common';
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
}
