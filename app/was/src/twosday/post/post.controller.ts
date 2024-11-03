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
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/user/decorator/user.decorator';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TwosdayPostService } from './post.service';
import { PostOrderPipe } from './pipe/post-order.pipe';

@Controller('api/twosday')
export class TwosdayPostController {
  constructor(private readonly twosdayPostService: TwosdayPostService) {}

  // 이미지 배열을 받아서 테이블에 저장
  // 태그 배열을 받아서 테이블에 저장
  // 태그 이미지가 없으면 생성
  // 게시글을 생성
  @Get('post')
  async getAllPost(
    @Query('order', PostOrderPipe) order: 'popular' | 'recent',
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    const [data, total] = await this.twosdayPostService.getAllPosts(
      page,
      size,
      order,
    );
    return {
      data: { post: data, total, size },
      message: ['게시글이 조회되었습니다.'],
    };
  }

  // 조회시 조회수를 1증가
  @Get('post/:id')
  async getPostsById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.twosdayPostService.getPostById(id);
    return { data: post, message: ['게시글이 조회되었습니다.'] };
  }

  @Post('post')
  @UseGuards(AccessGuard)
  async postPosts(@User('id') userId: number, @Body() postDto: PostDto) {
    const result = await this.twosdayPostService.createPost(userId, postDto);
    return { data: { id: result.id }, message: ['게시글이 생성되었습니다.'] };
  }

  // put   -> 전체 수정, 존재하지 않을시 생성
  // patch -> 일부 수정
  // 이미지 배열을 수정
  // 이미지가 빠졌을시 삭제
  // 태그 배열을 수정
  // 태그가 없을시 생성
  // 게시글 수정
  @Patch('post/:id')
  async patchPostsById(
    @Param('id', ParseIntPipe) id: number,
    @Body() postDto: UpdatePostDto,
  ) {
    const result = await this.twosdayPostService.updatePost(id, postDto);
    return { data: { id: result.id }, message: ['게시글이 수정되었습니다.'] };
  }

  // 게시글 삭제
  // 이미지 삭제
  @Delete('post/:id')
  async deletePostsById(@Param('id', ParseIntPipe) id: number) {
    const result = await this.twosdayPostService.deletePost(id);
    return { data: { id: result }, message: ['게시글이 삭제되었습니다.'] };
  }

  // 게시글 공개

  // 게시글 비공개
}
