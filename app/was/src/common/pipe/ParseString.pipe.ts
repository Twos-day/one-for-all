import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseStringPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string') {
      throw new BadRequestException('문자열만 입력할 수 있습니다.');
    }

    if (value.trim().length < 1) {
      throw new BadRequestException('공백은 입력할 수 없습니다.');
    }
    return value;
  }
}
