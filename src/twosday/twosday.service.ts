import { Injectable } from '@nestjs/common';

@Injectable()
export class TwosdayService {
  create(createTwosdayDto: any) {
    return 'This action adds a new twosday';
  }

  findAll() {
    return `This action returns all twosday`;
  }

  findOne(id: number) {
    return `This action returns a #${id} twosday`;
  }

  update(id: number, updateTwosdayDto: any) {
    return `This action updates a #${id} twosday`;
  }

  remove(id: number) {
    return `This action removes a #${id} twosday`;
  }
}
