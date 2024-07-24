import { TwosdayPostModel } from '../entity/post.entity';
declare const UpdatePostDto_base: import("@nestjs/mapped-types").MappedType<Partial<TwosdayPostModel>>;
export declare class UpdatePostDto extends UpdatePostDto_base {
    title?: string;
    content?: string;
}
export {};
