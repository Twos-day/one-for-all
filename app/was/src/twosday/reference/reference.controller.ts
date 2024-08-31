import { AccessGuard } from '@/auth/guard/after-login.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { TwosdayReferenceService } from './reference.service';
import { Info } from './type/info.type';

@Controller('api/twosday')
export class TwosdayReferenceController {
  constructor(private readonly referenceService: TwosdayReferenceService) {}

  @Get('reference')
  async get(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    const [data, total] = await this.referenceService.getReferences(page, size);
    return {
      message: ['레퍼런스가 조회되었습니다.'],
      data: {
        reference: data,
        total,
        size,
      },
    };
  }

  @Post('reference')
  @UseGuards(AccessGuard)
  async post(@Body() body: CreateReferenceDto) {
    const vid = this.referenceService.extractYoutubeVId(body.url);

    let info: Info;

    if (vid) {
      info = await this.referenceService.getYoutubeInfoByVId(vid);
    } else {
      info = await this.referenceService.crawlingUrl(body.url);
    }

    await this.referenceService.createReference(info);

    return { data: null, message: ['레퍼런스가 저장되었습니다.'] };
  }

  @Delete('reference/:id')
  @UseGuards(AccessGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.referenceService.deleteReference(id);
    return { data: null, message: ['레퍼런스가 삭제되었습니다.'] };
  }
}
