import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TwosdayReferenceService } from './reference.service';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { Info } from './type/info.type';
import { count } from 'console';

@Controller('api/twosday')
export class TwosdayReferenceController {
  constructor(private readonly referenceService: TwosdayReferenceService) {}

  @Get('reference')
  async get(@Query('page', ParseIntPipe) page: number) {
    const [data, total] = await this.referenceService.getReferences(page);
    return {
      message: ['레퍼런스가 조회되었습니다.'],
      data: {
        reference: data,
        total,
        length: data.length,
      },
    };
  }

  @Post('reference')
  async post(@Body() body: CreateReferenceDto) {
    const vid = this.referenceService.extractYoutubeVId(body.url);

    let info: Info;

    if (vid) {
      info = await this.referenceService.getYoutubeInfoByVId(vid);
    } else {
      info = await this.referenceService.crawlingUrl(body.url);
    }

    const result = await this.referenceService.createReference(info);

    return { message: ['레퍼런스가 저장되었습니다.'], data: result };
  }
}
