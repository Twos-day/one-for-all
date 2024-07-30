import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class PostDto {
  @Length(1, 255)
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsString()
  content: string;

  @IsBoolean()
  isPublic: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  tags: number[];
}
