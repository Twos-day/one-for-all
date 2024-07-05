import { Controller } from '@nestjs/common';
import { TwosdayTagService } from './tag.service';

@Controller('api/twosday/tag')
export class TwosdayTagController {
  constructor(private readonly tagService: TwosdayTagService) {}
}
