import { UserModel } from '@/user/entities/user.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { TwosdayPostModel } from './entity/post.entity';
import { PostDto } from './dto/post.dto';
import { TwosdayTagService } from '../tag/tag.service';

@Injectable()
export class TwosdayPostService {
  constructor(
    @InjectRepository(TwosdayPostModel)
    private readonly postsRepository: Repository<TwosdayPostModel>,
    private readonly commonService: CommonService,
    private readonly tagsService: TwosdayTagService,
  ) {}

  async getAllPosts(user?: UserModel) {
    return this.postsRepository.find({
      relations: ['author', 'tags'],
      where: [{ isPublic: false }, { author: { id: user.id } }],
      select: {
        author: {
          email: true,
          avatar: true,
          nickname: true,
        },
      },
    });
  }

  async getPostById(postId: number, user?: UserModel) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (post.author.id !== user.id && !post.isPublic) {
      throw new ForbiddenException('접근 할 수 없는 게시글입니다.');
    }

    return post;
  }

  async createPost(authorId: number, postDto: PostDto) {
    const tagsModel = await this.tagsService.getTags(postDto.tags);

    const post = this.postsRepository.create({
      author: { id: authorId },
      ...postDto,
      tags: tagsModel,
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
