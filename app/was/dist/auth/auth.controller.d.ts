import { MailService } from '@/mail/mail.service';
import { AccountType } from '@/user/const/account-type.const';
import { UserModel } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { PatchEmailUserDto, PostEmailUserDto, PostVerificationDto } from './dto/email-user.dto';
import { PatchSocialUserDto, SocialUserDto } from './dto/social-user.dto';
export declare class AuthController {
    private readonly authService;
    private readonly mailService;
    private readonly userService;
    constructor(authService: AuthService, mailService: MailService, userService: UserService);
    googleAuth(): Promise<void>;
    googleAuthRedirect(googleUser: SocialUserDto, req: Request): Promise<void>;
    kakaoAuth(): Promise<void>;
    kakaoAuthRedirect(kakaoUser: SocialUserDto, req: Request): Promise<void>;
    postSignupEmail(emailUser: PostEmailUserDto, req: Request): Promise<{
        data: {
            id: number;
        };
        message: string[];
    }>;
    postVerificationCode(id: number): Promise<{
        data: any;
        message: string[];
    }>;
    checkVerificationCode(dto: PostVerificationDto): Promise<{
        data: {
            token: string;
        };
        message: string[];
    }>;
    getVerification(user: UserModel): Promise<{
        data: {
            accessToken: string;
            id: number;
            email: string;
            avatar: string | null;
            nickname: string;
            accountType: AccountType;
            level: number;
            status: import("../user/const/status.const").StatusEnum;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string[];
    }>;
    patchSignupEmail(user: UserModel, dto: PatchEmailUserDto, req: Request): Promise<{
        data: any;
        message: string[];
    }>;
    patchSignupSocial(user: UserModel, dto: PatchSocialUserDto, req: Request): Promise<{
        data: any;
        message: string[];
    }>;
    postLoginEmail(user: UserModel, req: Request): Promise<{
        data: any;
        message: string[];
    }>;
    getSession(user: UserModel): Promise<{
        data: {
            accessToken: string;
            id: number;
            email: string;
            avatar: string | null;
            nickname: string;
            accountType: AccountType;
            level: number;
            status: import("../user/const/status.const").StatusEnum;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string[];
    }>;
    deleteUser(id: number): Promise<{
        data: any;
        message: string[];
    }>;
}
