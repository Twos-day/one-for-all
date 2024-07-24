import { Module } from '@nestjs/common';
import { TwosdayPostModule } from './post/post.module';
import { TwosdayTagModule } from './tag/tag.module';
import { TwosdayController } from './twosday.controller';
import { TwosdayService } from './twosday.service';
import { TwosdayReferenceModule } from './reference/reference.module';

@Module({
  imports: [TwosdayPostModule, TwosdayTagModule, TwosdayReferenceModule],
  controllers: [TwosdayController],
  providers: [TwosdayService],
})
export class TwosdayModule {}
