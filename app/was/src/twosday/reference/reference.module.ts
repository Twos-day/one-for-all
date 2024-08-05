import { CommonModule } from '@/common/common.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwosdayReferenceModel } from './entities/reference.entity';
import { TwosdayReferenceController } from './reference.controller';
import { TwosdayReferenceService } from './reference.service';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([TwosdayReferenceModel]),
  ],
  controllers: [TwosdayReferenceController],
  providers: [TwosdayReferenceService],
  exports: [TwosdayReferenceService],
})
export class TwosdayReferenceModule {}
