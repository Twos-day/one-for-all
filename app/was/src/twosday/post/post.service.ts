import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { TwosdayTagService } from '../tag/tag.service';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TwosdayPostModel } from './entity/post.entity';

@Injectable()
export class TwosdayPostService {
  constructor(
    @InjectRepository(TwosdayPostModel)
    private readonly postsRepository: Repository<TwosdayPostModel>,
    private readonly commonService: CommonService,
    private readonly tagsService: TwosdayTagService,
  ) {}

  async getAllPosts(page: number, size: number, order: 'popular' | 'recent') {
    return this.postsRepository.findAndCount({
      relations: ['author', 'tags'],
      where: { isPublic: true },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        viewCount: true,
        updatedAt: true,
        createdAt: true,
        author: {
          id: true,
          nickname: true,
          avatar: true,
          email: true,
        },
        tags: {
          id: true,
          name: true,
        },
      },
      // 페이지는 1보다 작을 수 없음
      skip: page < 2 ? 0 : (page - 1) * size,
      take: size,
      order: {
        viewCount: order === 'popular' ? 'DESC' : undefined, // 위 조건이 우선순위
        updatedAt: 'DESC',
      },
    });
  }

  async getPostById(postId: number) {
    const post = await this.postsRepository.findOne({
      relations: ['author', 'tags'],
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (!post.isPublic) {
      throw new ForbiddenException('접근 할 수 없는 게시글입니다.');
    }

    await this.postsRepository.increment({ id: postId }, 'viewCount', 1);

    post.viewCount += 1;
    return post;
  }

  async createPost(authorId: number, postDto: PostDto) {
    const post = this.postsRepository.create({
      author: { id: authorId },
      ...postDto,
      tags: postDto.tags.map((tagId) => ({ id: tagId })),
    });

    const newPost = await this.postsRepository.save(post);
    return newPost;
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException();
    if (postDto.title) post.title = postDto.title;
    if (postDto.content) post.content = postDto.content;
    return this.postsRepository.save(post);
  }

  async deletePost(postId: number) {
    const result = await this.postsRepository.softDelete(postId);
    if (!result.affected) throw new NotFoundException();
    return postId;
  }
}
