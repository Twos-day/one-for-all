import { CommonModule } from '@/common/common.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwosdayReferenceModel } from './entities/reference.entity';
import { TwosdayReferenceController } from './reference.controller';
import { TwosdayReferenceService } from './reference.service';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([TwosdayReferenceModel])],
  controllers: [TwosdayReferenceController],
  providers: [TwosdayReferenceService],
  exports: [TwosdayReferenceService],
})
export class TwosdayReferenceModule {}
