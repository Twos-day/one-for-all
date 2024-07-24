export declare enum OrderBy {
    'ASC' = "ASC",
    'DESC' = "DESC"
}
export declare class BasePaginationDto {
    page?: number;
    where__id__less_than?: number;
    where__id__more_than?: number;
    order__createdAt?: OrderBy;
    take?: number;
}
