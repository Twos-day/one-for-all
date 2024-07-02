import { PostModel } from '../entity/post.entity';
import { PickType } from '@nestjs/mapped-types';

// data transfer pobject
export class CreatePostDto extends PickType(PostModel, ['title', 'content']) {}
