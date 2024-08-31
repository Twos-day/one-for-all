import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { TwosdayTagService } from '../tag/tag.service';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TwosdayPostModel } from './entity/post.entity';
export declare class TwosdayPostService {
    private readonly postsRepository;
    private readonly commonService;
    private readonly tagsService;
    constructor(postsRepository: Repository<TwosdayPostModel>, commonService: CommonService, tagsService: TwosdayTagService);
    getAllPosts(page: number, size: number, order: 'popular' | 'recent'): Promise<[TwosdayPostModel[], number]>;
    getPostById(postId: number): Promise<TwosdayPostModel>;
    createPost(authorId: number, postDto: PostDto): Promise<TwosdayPostModel>;
    updatePost(postId: number, postDto: UpdatePostDto): Promise<TwosdayPostModel>;
    deletePost(postId: number): Promise<number>;
}
