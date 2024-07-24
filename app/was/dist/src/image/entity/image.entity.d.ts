import { BaseModel } from '@/common/entity/base.entity';
import { UserModel } from '@/user/entities/user.entity';
export declare class ImageModel extends BaseModel {
    user: UserModel;
    key: string;
}
