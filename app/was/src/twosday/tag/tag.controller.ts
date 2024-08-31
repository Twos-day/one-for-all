import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TwosdayTagService } from './tag.service';
import { AccessGuard } from '@/auth/guard/after-login.guard';
import { ParseStringPipe } from '@/common/pipe/ParseString.pipe';

@Controller('api/twosday')
export class TwosdayTagController {
  constructor(private readonly tagService: TwosdayTagService) {}

  @Get('tag')
  async getAllTags() {
    const tags = await this.tagService.getAllTags();
    return { data: tags, message: ['태그가 조회되었습니다.'] };
  }

  @Post('tag')
  async postTag(@Body('name', ParseStringPipe) name: string) {
    const tagModel = await this.tagService.postTag(name);
    return {
      data: { id: tagModel.id, name: tagModel.name },
      message: ['태그가 생성되었습니다.'],
    };
  }

  @Patch('tag/:id')
  @UseGuards(AccessGuard)
  async patchTag(
    @Param('id', ParseIntPipe) id: number,
    @Body('name', ParseStringPipe) name: string,
  ) {
    await this.tagService.patchTag(id, name);
    return { data: null, message: ['태그가 수정되었습니다.'] };
  }

  @Delete('tag/:id')
  @UseGuards(AccessGuard)
  async deleteTag(@Param('id', ParseIntPipe) id: number) {
    await this.tagService.deleteTag(id);
    return { data: null, message: ['태그가 삭제되었습니다.'] };
  }
}
