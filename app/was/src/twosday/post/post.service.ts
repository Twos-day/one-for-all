import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { DataSource, Repository } from 'typeorm';
import { TwosdayTagService } from '../tag/tag.service';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TwosdayPostModel } from './entity/post.entity';
import { ImageService } from '@/image/image.service';
import { POST_SELECT_OPTIONS } from './post.const';

@Injectable()
export class TwosdayPostService {
  constructor(
    @InjectRepository(TwosdayPostModel)
    private readonly postsRepository: Repository<TwosdayPostModel>,
    private readonly commonService: CommonService,
    private readonly imageService: ImageService,
    private readonly tagsService: TwosdayTagService,
    // private readonly dataSource: DataSource,
  ) {}

  async getAllPosts(page: number, size: number, order: 'popular' | 'recent') {
    // TODO: 비공개 게시글 조회 api를 따로 만들어야 할지 고민
    return this.postsRepository.findAndCount({
      ...POST_SELECT_OPTIONS,
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
      ...POST_SELECT_OPTIONS,
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException();
    }

    // TODO: 비공개 게시글 조회 api를 따로 만들어야 할지 고민
    // if (!post.isPublic) {
    //   throw new ForbiddenException('접근 할 수 없는 게시글입니다.');
    // }

    await this.postsRepository.increment({ id: postId }, 'viewCount', 1);

    post.viewCount += 1;
    return post;
  }

  async createPost(authorId: number, postDto: PostDto) {
    // const qr = this.dataSource.createQueryRunner();
    // await qr.connect();
    // await qr.startTransaction();
    // try {
    const images = await Promise.all(
      postDto.images.map((key) =>
        this.imageService.saveImageUrl({ key, userId: authorId }),
      ),
    );

    const post = this.postsRepository.create({
      ...postDto,
      author: { id: authorId },
      tags: postDto.tags.map((tagId) => ({ id: tagId })),
      images,
    });

    const newPost = await this.postsRepository.save(post);
    return newPost;
    //   await qr.commitTransaction();
    //   await qr.release();
    // } catch (e) {
    //   await qr.rollbackTransaction();
    //   await qr.release();
    // }
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
