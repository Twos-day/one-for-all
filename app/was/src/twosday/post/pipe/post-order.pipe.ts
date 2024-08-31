import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PostOrderPipe implements PipeTransform {
  transform(value: any) {
    console.log(value);
    if (value !== 'popular' && value !== 'recent') {
      throw new BadRequestException('잘못된 order 입니다.');
    }

    return value;
  }
}
