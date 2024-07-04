import { BaseModel } from '@/common/entity/base.entity';
import { ImageModel } from '@/image/entity/image.entity';
import { TwosdayPostModel } from '@/twosday/post/entity/post.entity';
import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length, IsOptional } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { StatusEnum } from '../const/status.const';

@Entity()
export class UserModel extends BaseModel {
  @IsString()
  @Length(1, 20)
  @Column({ length: 20 })
  nickname: string;

  @IsString()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsString()
  @IsOptional()
  @Exclude({ toPlainOnly: true }) // password는 반환하지 않음
  @Column({ nullable: true })
  password: string | null;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  avatar: string | null;

  @Column()
  isSocial: boolean;

  @Length(6)
  @IsString()
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  verificationCode: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  expiresAt: Date;

  @Column({ type: 'enum', enum: StatusEnum })
  status: StatusEnum;

  @Column({ nullable: true })
  loginAt: Date;

  @Column({ default: 1 })
  level: number;

  @OneToMany(() => TwosdayPostModel, (post) => post.author)
  posts: TwosdayPostModel[];

  @OneToMany(() => ImageModel, (image) => image.user)
  images: ImageModel[];
}
