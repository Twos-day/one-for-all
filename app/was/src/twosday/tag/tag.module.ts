import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AwsModule } from 'src/aws/aws.module';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { TwosdayTagModel } from './entity/tag.entity';
import { TwosdayTagService } from './tag.service';
import { TwosdayTagController } from './tag.controller';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CommonModule,
    AwsModule,
    TypeOrmModule.forFeature([TwosdayTagModel]),
  ],
  controllers: [TwosdayTagController],
  providers: [TwosdayTagService],
  exports: [TwosdayTagService],
})
export class TwosdayTagModule {}
