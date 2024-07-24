export declare class PostEmailUserDto {
    email: string;
}
export declare class PostVerificationDto {
    id: number;
    email: string;
    code: string;
}
export declare class PatchEmailUserDto {
    password: string;
    nickname: string;
    avatar: string | undefined;
}
