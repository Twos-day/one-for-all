import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AwsModule } from 'src/aws/aws.module';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { TwosdayPostModel } from './entity/post.entity';
import { TwosdayPostController } from './post.controller';
import { TwosdayPostService } from './post.service';
import { TwosdayTagModule } from '../tag/tag.module';
import { ImageModule } from '@/image/image.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CommonModule,
    AwsModule,
    TwosdayTagModule,
    ImageModule,
    TypeOrmModule.forFeature([TwosdayPostModel]),
  ],
  controllers: [TwosdayPostController],
  providers: [TwosdayPostService],
  exports: [TwosdayPostService],
})
export class TwosdayPostModule {}
