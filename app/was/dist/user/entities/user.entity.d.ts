import { BaseModel } from '@/common/entity/base.entity';
import { ImageModel } from '@/image/entity/image.entity';
import { TwosdayPostModel } from '@/twosday/post/entity/post.entity';
import { AccountType } from '../const/account-type.const';
import { StatusEnum } from '../const/status.const';
export declare class UserModel extends BaseModel {
    nickname: string;
    email: string;
    password: string | null;
    avatar: string | null;
    accountType?: AccountType;
    verificationCode: string;
    expiresAt: Date | null;
    status: StatusEnum;
    level: number;
    posts: TwosdayPostModel[];
    images: ImageModel[];
}
