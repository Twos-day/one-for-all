import { ActivatedUserGuard } from '@/auth/guard/bear-token.guard';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/user/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TwosdayPostService } from './post.service';

@Controller('api/twosday')
export class TwosdayPostController {
  constructor(private readonly twosdayPostService: TwosdayPostService) {}

  @Get('post')
  async getAllPost() {
    const posts = await this.twosdayPostService.getAllPosts();
    return { posts };
  }

  @Get('post/:id')
  async getPostsById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.twosdayPostService.getPostById(id);
    return { post };
  }

  @Post('post')
  @UseGuards(ActivatedUserGuard)
  postPosts(@User('id') userId: number, @Body() postDto: CreatePostDto) {
    console.log('dto', postDto);
    return this.twosdayPostService.createPost(userId, postDto);
  }

  // put   -> 전체 수정, 존재하지 않을시 생성
  // patch -> 일부 수정
  @Patch('post/:id')
  patchPostsById(
    @Param('id', ParseIntPipe) id: number,
    @Body() postDto: UpdatePostDto,
  ) {
    return this.twosdayPostService.updatePost(id, postDto);
  }

  @Delete('post/:id')
  deletePostsById(@Param('id', ParseIntPipe) id: number) {
    return this.twosdayPostService.deletePost(id);
  }
}
