import { TwosdayTagService } from './tag.service';
export declare class TwosdayTagController {
    private readonly tagService;
    constructor(tagService: TwosdayTagService);
    getAllTags(): Promise<{
        data: import("./entity/tag.entity").TwosdayTagModel[];
        message: string[];
    }>;
    postTag(name: string): Promise<{
        data: {
            id: number;
            name: string;
        };
        message: string[];
    }>;
    patchTag(id: number, name: string): Promise<{
        data: any;
        message: string[];
    }>;
    deleteTag(id: number): Promise<{
        data: any;
        message: string[];
    }>;
}
