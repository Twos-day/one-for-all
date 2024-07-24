import { PatchEmailUserDto, PostEmailUserDto, PostVerificationDto } from '@/auth/dto/email-user.dto';
import { PatchSocialUserDto, SocialUserDto } from '@/auth/dto/social-user.dto';
import { Repository } from 'typeorm';
import { StatusEnum } from './const/status.const';
import { UserModel } from './entities/user.entity';
import { AccountType } from './const/account-type.const';
export declare class UserService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<UserModel>);
    getUserById(id: number): Promise<UserModel | undefined>;
    getUserByEmail(email: string): Promise<UserModel | undefined>;
    deleteUser(id: number): Promise<import("typeorm").UpdateResult>;
    registerUser(dto: PostEmailUserDto | SocialUserDto): Promise<UserModel>;
    patchUser(user: UserModel, dto: PatchEmailUserDto | PatchSocialUserDto, accountType: AccountType): Promise<({
        accountType: AccountType;
        status: StatusEnum;
        password: string;
        nickname: string;
        avatar: string | undefined;
        email: string;
        verificationCode: string;
        expiresAt: Date | null;
        level: number;
        posts: import("../twosday/post/entity/post.entity").TwosdayPostModel[];
        images: import("../image/entity/image.entity").ImageModel[];
        id: number;
        updatedAt: Date;
        createdAt: Date;
        deletedAt?: Date;
    } | {
        accountType: AccountType;
        status: StatusEnum;
        nickname: string;
        avatar: string | undefined;
        email: string;
        password: string | null;
        verificationCode: string;
        expiresAt: Date | null;
        level: number;
        posts: import("../twosday/post/entity/post.entity").TwosdayPostModel[];
        images: import("../image/entity/image.entity").ImageModel[];
        id: number;
        updatedAt: Date;
        createdAt: Date;
        deletedAt?: Date;
    }) & UserModel>;
    generateVerificationCode(id: number): Promise<{
        email: string;
        code: string;
    }>;
    checkVerificationCode(dto: PostVerificationDto): Promise<UserModel>;
}
