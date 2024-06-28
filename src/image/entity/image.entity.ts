import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ImageModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.images, { nullable: false })
  user: UsersModel;

  @IsString()
  @Column()
  key: string; // S3에 저장된 이미지의 키
}
