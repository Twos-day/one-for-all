import { TwosdayTagModel } from '@/twosday/tag/entity/tag.entity';
import { IsArray, IsBoolean, IsString, Length } from 'class-validator';

export class PostDto {
  @Length(1, 255)
  @IsString()
  title: string;

  @IsString()
  thumbnail: string;

  @IsString()
  content: string;

  @IsBoolean()
  isPublic: boolean;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
