import { TwosdayPostModel } from '@/twosday/post/entity/post.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('twosday_tag_model')
export class TwosdayTagModel extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToMany(() => TwosdayPostModel, (post) => post.tags)
  posts: TwosdayTagModel[];
}
