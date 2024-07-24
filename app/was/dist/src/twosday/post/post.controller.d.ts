import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TwosdayPostService } from './post.service';
export declare class TwosdayPostController {
    private readonly twosdayPostService;
    constructor(twosdayPostService: TwosdayPostService);
    getAllPost(): Promise<{
        data: {
            posts: import("./entity/post.entity").TwosdayPostModel[];
        };
        message: string[];
    }>;
    getPostsById(id: number): Promise<{
        data: import("./entity/post.entity").TwosdayPostModel;
        message: string[];
    }>;
    postPosts(userId: number, postDto: PostDto): Promise<{
        data: any;
        message: string[];
    }>;
    patchPostsById(id: number, postDto: UpdatePostDto): Promise<{
        data: any;
        message: string[];
    }>;
    deletePostsById(id: number): Promise<{
        data: any;
        message: string[];
    }>;
}
