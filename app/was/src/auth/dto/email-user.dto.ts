import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class EmailUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'example@naver.com' })
  email: string;
}
