import { TwosdayTagModel } from '@/twosday/tag/entity/tag.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { UserModel } from 'src/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity('twosday_post_model')
export class TwosdayPostModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.posts, { nullable: false })
  author: UserModel;

  @ManyToMany(() => TwosdayTagModel, (tag) => tag.posts, { cascade: true })
  @JoinTable()
  tags: TwosdayTagModel[];

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column()
  thumbnail: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: 0 })
  viewCount: number;
}
