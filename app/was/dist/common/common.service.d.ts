import { BasePaginationDto } from './dto/base-pagination.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseModel } from './entity/base.entity';
export declare class CommonService {
    paginate<T extends BaseModel>(dto: BasePaginationDto, repository: Repository<T>, overrideFindOptions: FindManyOptions<T>, path: string): Promise<{
        data: T[];
        total: number;
    }> | Promise<{
        data: T[];
        cursor: {
            after: number;
        };
        count: number;
        next: string;
    }>;
    private pagePaginate;
    private cursorPaginate;
    private composeFindOptions;
    private parseWhereFilter;
}
