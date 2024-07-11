import { TwosdayTagModel } from '@/twosday/tag/entity/tag.entity';
import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/validator/message/string.message';
import { UserModel } from 'src/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity('twosday_post_model')
export class TwosdayPostModel extends BaseModel {
  // usersModel과 연결
  // null이 될 수 없다.
  @ManyToOne(() => UserModel, (user) => user.posts, { nullable: false })
  author: UserModel;

  @IsArray()
  @IsString({ each: true })
  @ManyToMany(() => TwosdayTagModel, (tag) => tag.posts, { cascade: true })
  @JoinTable()
  tags: TwosdayTagModel[];

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  title: string;

  @Column('text')
  @IsString()
  content: string;

  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isPublic: boolean;
}
