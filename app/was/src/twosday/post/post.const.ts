import { FindManyOptions } from 'typeorm';
import { TwosdayPostModel } from './entity/post.entity';

export const POST_SELECT_OPTIONS: FindManyOptions<TwosdayPostModel> = {
  relations: ['author', 'tags', 'images'],
  select: {
    id: true,
    title: true,
    viewCount: true,
    updatedAt: true,
    createdAt: true,
    author: {
      id: true,
      nickname: true,
      avatar: true,
      email: true,
    },
    tags: {
      id: true,
      name: true,
    },
    images: {
      id: true,
      key: true,
    },
  },
};
