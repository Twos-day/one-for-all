import { TwosdayTagModel } from '@/twosday/tag/entity/tag.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { UserModel } from 'src/user/entities/user.entity';
export declare class TwosdayPostModel extends BaseModel {
    author: UserModel;
    tags: TwosdayTagModel[];
    title: string;
    thumbnail: string | null;
    content: string;
    isPublic: boolean;
    viewCount: number;
}
