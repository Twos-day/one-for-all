import { TwosdayPostModel } from '../entity/post.entity';
import { PickType } from '@nestjs/mapped-types';

// data transfer pobject
export class CreatePostDto extends PickType(TwosdayPostModel, [
  'title',
  'content',
]) {}
