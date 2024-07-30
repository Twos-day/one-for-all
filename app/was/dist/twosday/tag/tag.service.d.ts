import { ConfigService } from '@nestjs/config';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { TwosdayTagModel } from './entity/tag.entity';
export declare class TwosdayTagService {
    private readonly postsRepository;
    private readonly configService;
    private readonly commonService;
    constructor(postsRepository: Repository<TwosdayTagModel>, configService: ConfigService, commonService: CommonService);
    getTags(): Promise<TwosdayTagModel[]>;
    postTag(tag: string): Promise<TwosdayTagModel>;
    patchTag(id: number, tag: string): Promise<import("typeorm").UpdateResult>;
    deleteTag(id: number): Promise<import("typeorm").DeleteResult>;
}
