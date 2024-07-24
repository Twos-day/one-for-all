import { AccountType } from '@/user/const/account-type.const';
import { StatusEnum } from '@/user/const/status.const';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { SocialUserDto } from './dto/social-user.dto';
type Payload = {
    id: number;
    email: string;
    accountType: AccountType;
    avatar?: string;
    nickname?: string;
};
export declare class AuthService {
    private readonly jwrService;
    private readonly userService;
    constructor(jwrService: JwtService, userService: UserService);
    extractTokenFromReq(req: Request, isBearer: boolean): string;
    decodeBasicToken(token: string): {
        email: string;
        password: string;
    };
    veryfySocialUser(req: Request, socialUser: SocialUserDto, accountType: AccountType): Promise<void>;
    verifyEmailUser(user: UserModel): void;
    authenticateWithEmailAndPassword(payload: {
        email: string;
        password: string;
    }): Promise<UserModel>;
    verifyToken(token: string, isRefresh: boolean): Payload;
    generateRefreshToken(user: UserModel): string;
    setRefreshToken(res: Response, token: string): void;
    createSession(user: UserModel): {
        accessToken: string;
        id: number;
        email: string;
        avatar: string | null;
        nickname: string;
        accountType: AccountType;
        level: number;
        status: StatusEnum;
        createdAt: Date;
        updatedAt: Date;
    };
}
export {};
