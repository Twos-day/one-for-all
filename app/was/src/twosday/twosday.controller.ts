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

@Controller('api/twosday')
export class TwosdayController {
  constructor(private readonly twosdayService: TwosdayService) {}

  @Get()
  hello() {
    return { data: null, message: ['Hello, Twosday!'] };
  }
}
