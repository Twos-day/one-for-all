import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UserModel } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ImageModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.images, { nullable: false })
  user: UserModel;

  @IsString()
  @Column()
  key: string; // S3에 저장된 이미지의 키
}
