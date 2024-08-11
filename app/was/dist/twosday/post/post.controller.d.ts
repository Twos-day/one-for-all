import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TwosdayPostService } from './post.service';
export declare class TwosdayPostController {
    private readonly twosdayPostService;
    constructor(twosdayPostService: TwosdayPostService);
    getAllPost(order: 'popular' | 'recent', page: number, size: number): Promise<{
        data: {
            post: import("./entity/post.entity").TwosdayPostModel[];
            total: number;
            size: number;
        };
        message: string[];
    }>;
    getPostsById(id: number): Promise<{
        data: import("./entity/post.entity").TwosdayPostModel;
        message: string[];
    }>;
    postPosts(userId: number, postDto: PostDto): Promise<{
        data: {
            id: number;
        };
        message: string[];
    }>;
    patchPostsById(id: number, postDto: UpdatePostDto): Promise<{
        data: {
            id: number;
        };
        message: string[];
    }>;
    deletePostsById(id: number): Promise<{
        data: {
            id: number;
        };
        message: string[];
    }>;
}
