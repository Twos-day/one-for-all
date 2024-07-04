import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/validator/message/string.message';
import { UserModel } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('twosday_post_model')
export class TwosdayPostModel extends BaseModel {
  // usersModel과 연결
  // null이 될 수 없다.
  @ManyToOne(() => UserModel, (user) => user.posts, { nullable: false })
  author: UserModel;

  @Column()
  @IsString({ message: stringValidationMessage })
  title: string;

  @Column()
  @IsString({ message: stringValidationMessage })
  content: string;

  @Column({
    nullable: true,
  })
  @Transform(({ value }) => value && `/public/posts/${value}`)
  image?: string;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  commentCount: number;
}
