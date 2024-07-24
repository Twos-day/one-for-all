import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class PasswordPipe implements PipeTransform {
    transform(value: any, _metadata: ArgumentMetadata): any;
}
export declare class MaxLengthPipe implements PipeTransform {
    private readonly maxLength;
    constructor(maxLength: number);
    transform(value: any, _metadata: ArgumentMetadata): any;
}
export declare class MinLengthPipe implements PipeTransform {
    private readonly minLength;
    constructor(minLength: number);
    transform(value: any, _metadata: ArgumentMetadata): any;
}
