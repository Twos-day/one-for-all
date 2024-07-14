import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class PostEmailUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'example@naver.com' })
  email: string;
}

export class PostVerificationDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'example@naver.com' })
  email: string;

  @IsString()
  @Length(6)
  code: string;
}

export class PatchEmailUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'example@naver.com' })
  email: string;

  @IsString()
  password: string;

  @IsString()
  @Length(1, 20)
  @ApiProperty()
  nickname: string;

  @IsOptional()
  @IsString()
  avatar: string | undefined;
}
