import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AwsModule } from 'src/aws/aws.module';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { PostModel } from './entity/post.entity';
import { PostService } from './post.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CommonModule,
    AwsModule,
    TypeOrmModule.forFeature([PostModel]),
  ],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
