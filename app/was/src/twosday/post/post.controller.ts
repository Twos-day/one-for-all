import { AccessGuard } from '@/auth/guard/after-login.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/user/decorator/user.decorator';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TwosdayPostService } from './post.service';

@Controller('api/twosday')
export class TwosdayPostController {
  constructor(private readonly twosdayPostService: TwosdayPostService) {}

  @Get('post')
  async getAllPost() {
    const posts = await this.twosdayPostService.getAllPosts();
    return { data: { posts }, message: ['게시글이 조회되었습니다.'] };
  }

  @Get('post/:id')
  async getPostsById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.twosdayPostService.getPostById(id);
    return { data: post, message: ['게시글이 조회되었습니다.'] };
  }

  @Post('post')
  @UseGuards(AccessGuard)
  async postPosts(@User('id') userId: number, @Body() postDto: PostDto) {
    await this.twosdayPostService.createPost(userId, postDto);
    return { data: null, message: ['게시글이 생성되었습니다.'] };
  }

  // put   -> 전체 수정, 존재하지 않을시 생성
  // patch -> 일부 수정
  @Patch('post/:id')
  async patchPostsById(
    @Param('id', ParseIntPipe) id: number,
    @Body() postDto: UpdatePostDto,
  ) {
    await this.twosdayPostService.updatePost(id, postDto);
    return { data: null, message: ['게시글이 수정되었습니다.'] };
  }

  @Delete('post/:id')
  async deletePostsById(@Param('id', ParseIntPipe) id: number) {
    await this.twosdayPostService.deletePost(id);
    return { data: null, message: ['게시글이 삭제되었습니다.'] };
  }
}
