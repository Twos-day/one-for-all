import { TwosdayReferenceModel } from './entities/reference.entity';
import { Info } from './type/info.type';
import { Repository } from 'typeorm';
export declare const youtubeService: import("googleapis").youtube_v3.Youtube;
export declare class TwosdayReferenceService {
    private readonly referenceRepository;
    constructor(referenceRepository: Repository<TwosdayReferenceModel>);
    extractYoutubeVId(url: string): string;
    getYoutubeInfoByVId(videoId: string): Promise<{
        url: string;
        title: string;
        description: string;
        thumbnail: string;
    }>;
    crawlingUrl(url: string): Promise<Info>;
    createReference(info: Info): Promise<TwosdayReferenceModel>;
    getReferences(page: number): Promise<[TwosdayReferenceModel[], number]>;
    deleteReference(id: number): Promise<import("typeorm").DeleteResult>;
}
