import { BaseModel } from '@/common/entity/base.entity';
import { emailValidationMessage } from '@/common/validator/message/email.message';
import { lenghthValidationMessage } from '@/common/validator/message/length.message';
import { stringValidationMessage } from '@/common/validator/message/string.message';
import { ImageModel } from '@/image/entity/image.entity';
import { PostModel } from '@/twosday/post/entity/post.entity';
import { PostModel as PostModel2 } from '@/dummyPrj/post/entity/post.entity';
import { Exclude } from 'class-transformer';
import { IsEmail, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class UserModel extends BaseModel {
  @IsString({ message: stringValidationMessage })
  @Length(1, 20, { message: lenghthValidationMessage })
  @Column({ length: 20 })
  nickname: string;

  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: emailValidationMessage })
  @Column({ unique: true })
  email: string;

  @IsString({ message: stringValidationMessage })
  @Exclude({ toPlainOnly: true }) // password는 반환하지 않음
  @Column()
  password: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @Column({ default: 1 })
  level: number;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];

  @OneToMany(() => PostModel2, (post) => post.author)
  post2s: PostModel2[];

  @OneToMany(() => ImageModel, (image) => image.user)
  images: ImageModel[];
}
