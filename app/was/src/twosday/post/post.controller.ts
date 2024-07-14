import {
  ActivatedUserGuard,
  PublicUserGuard,
} from '@/auth/guard/bear-token.guard';
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
  @UseGuards(PublicUserGuard)
  async getAllPost() {
    const posts = await this.twosdayPostService.getAllPosts();
    return { posts };
  }

  @Get('post/:id')
  @UseGuards(PublicUserGuard)
  async getPostsById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.twosdayPostService.getPostById(id);
    return { post };
  }

  @Post('post')
  @UseGuards(ActivatedUserGuard)
  postPosts(@User('id') userId: number, @Body() postDto: PostDto) {
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
