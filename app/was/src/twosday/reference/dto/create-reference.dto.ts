import { IsString } from 'class-validator';

export class CreateReferenceDto {
  @IsString()
  url: string;
}
