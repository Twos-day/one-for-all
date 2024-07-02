import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TwosdayService } from './twosday.service';

@Controller('twosday')
export class TwosdayController {
  constructor(private readonly twosdayService: TwosdayService) {}

  @Post()
  create(@Body() createTwosdayDto: any) {
    return this.twosdayService.create(createTwosdayDto);
  }

  @Get()
  findAll() {
    return this.twosdayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.twosdayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTwosdayDto: any) {
    return this.twosdayService.update(+id, updateTwosdayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.twosdayService.remove(+id);
  }
}
