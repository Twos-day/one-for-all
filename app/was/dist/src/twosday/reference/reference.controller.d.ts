import { TwosdayReferenceService } from './reference.service';
import { CreateReferenceDto } from './dto/create-reference.dto';
export declare class TwosdayReferenceController {
    private readonly referenceService;
    constructor(referenceService: TwosdayReferenceService);
    get(page: number): Promise<{
        message: string[];
        data: {
            reference: import("./entities/reference.entity").TwosdayReferenceModel[];
            total: number;
            length: number;
        };
    }>;
    post(body: CreateReferenceDto): Promise<{
        message: string[];
        data: import("./entities/reference.entity").TwosdayReferenceModel;
    }>;
}
