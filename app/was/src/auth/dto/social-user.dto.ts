import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class SocialUserDto {
  nickname: string;
  email: string;
  accessToken: string;
  avatar: string;
}

export class PatchSocialUserDto {
  @IsString()
  @Length(1, 20)
  @ApiProperty()
  nickname: string;

  @IsOptional()
  @IsString()
  avatar: string | undefined;
}
