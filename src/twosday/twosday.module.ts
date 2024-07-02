import { Module } from '@nestjs/common';
import { TwosdayService } from './twosday.service';
import { TwosdayController } from './twosday.controller';
import { PostModule } from './post/post.module';

@Module({
  imports: [PostModule],
  controllers: [TwosdayController],
  providers: [TwosdayService],
})
export class TwosdayModule {}
