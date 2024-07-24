import { BaseModel } from 'src/common/entity/base.entity';
export declare class TwosdayTagModel extends BaseModel {
    id: number;
    name: string;
    color: string;
    posts: TwosdayTagModel[];
}
