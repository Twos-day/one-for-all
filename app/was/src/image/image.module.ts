import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { AwsModule } from 'src/aws/aws.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModel } from './entity/image.entity';

@Module({
  imports: [
    AwsModule,
    UserModule,
    CommonModule,
    AuthModule,
    TypeOrmModule.forFeature([ImageModel]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
