import { ConfigService } from '@nestjs/config';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { TwosdayTagModel } from './entity/tag.entity';
export declare class TwosdayTagService {
    private readonly postsRepository;
    private readonly configService;
    private readonly commonService;
    constructor(postsRepository: Repository<TwosdayTagModel>, configService: ConfigService, commonService: CommonService);
    postTag(tag: string): Promise<TwosdayTagModel>;
    getTags(tags: string[]): Promise<TwosdayTagModel[]>;
}
