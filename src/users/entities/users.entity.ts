import { Exclude } from 'class-transformer';
import { IsEmail, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { emailValidationMessage } from 'src/common/validator/message/email.message';
import { lenghthValidationMessage } from 'src/common/validator/message/length.message';
import { stringValidationMessage } from 'src/common/validator/message/string.message';
import { ImageModel } from 'src/image/entity/image.entity';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class UsersModel extends BaseModel {
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
  @Max(100)
  @Column({ default: 1 })
  level: number;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];

  @OneToMany(() => ImageModel, (image) => image.user)
  images: ImageModel[];
}
