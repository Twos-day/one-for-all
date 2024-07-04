import { BaseModel } from '@/common/entity/base.entity';
import { ImageModel } from '@/image/entity/image.entity';
import { TwosdayPostModel } from '@/twosday/post/entity/post.entity';
import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length, IsOptional } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { StatusEnum } from '../const/status.const';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserModel extends BaseModel {
  @IsString()
  @Length(1, 20)
  @Column({ length: 20 })
  @ApiProperty()
  nickname: string;

  @IsString()
  @IsEmail()
  @Column({ unique: true })
  @ApiProperty({ example: 'example@naver.com' })
  email: string;

  @IsString()
  @IsOptional()
  @Exclude({ toPlainOnly: true }) // password는 반환하지 않음
  @Column({ nullable: true })
  password: string | null;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  @ApiProperty()
  avatar: string | null;

  @Column()
  @ApiProperty()
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
  @ApiProperty()
  status: StatusEnum;

  @Column({ nullable: true })
  loginAt: Date;

  @Column({ default: 1 })
  @ApiProperty()
  level: number;

  @OneToMany(() => TwosdayPostModel, (post) => post.author)
  posts: TwosdayPostModel[];

  @OneToMany(() => ImageModel, (image) => image.user)
  images: ImageModel[];
}
