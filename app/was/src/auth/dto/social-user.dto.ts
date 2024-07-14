import { AccountType } from '@/user/const/account-type.const';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class SocialUserDto {
  nickname: string;
  email: string;
  accessToken: string;
  avatar: string;
}

export class PatchSocialUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'example@naver.com' })
  email: string;

  @IsString()
  @Length(1, 20)
  @ApiProperty()
  nickname: string;

  @IsOptional()
  @IsString()
  avatar: string | undefined;
}
