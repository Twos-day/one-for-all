import { Module } from '@nestjs/common';
import { TwosdayPostModule } from './post/post.module';
import { TwosdayTagModule } from './tag/tag.module';
import { TwosdayController } from './twosday.controller';
import { TwosdayService } from './twosday.service';

@Module({
  imports: [TwosdayPostModule, TwosdayTagModule],
  controllers: [TwosdayController],
  providers: [TwosdayService],
})
export class TwosdayModule {}
