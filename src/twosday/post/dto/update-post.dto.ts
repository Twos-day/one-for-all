import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { TwosdayPostModel } from '../entity/post.entity';

export class UpdatePostDto extends PartialType(TwosdayPostModel) {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
