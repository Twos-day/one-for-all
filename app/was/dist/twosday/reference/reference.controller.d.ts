import { CreateReferenceDto } from './dto/create-reference.dto';
import { TwosdayReferenceService } from './reference.service';
export declare class TwosdayReferenceController {
    private readonly referenceService;
    constructor(referenceService: TwosdayReferenceService);
    get(page: number, size: number): Promise<{
        message: string[];
        data: {
            reference: import("./entities/reference.entity").TwosdayReferenceModel[];
            total: number;
            size: number;
        };
    }>;
    post(body: CreateReferenceDto): Promise<{
        data: any;
        message: string[];
    }>;
    delete(id: number): Promise<{
        data: any;
        message: string[];
    }>;
}
