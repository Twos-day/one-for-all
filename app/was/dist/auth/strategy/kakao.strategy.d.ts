import { Strategy, Profile } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
export interface KakaoProfile extends Profile {
    accessToken: string;
    refreshToken: string;
}
declare const KakaoStrategy_base: new (...args: any[]) => Strategy;
export declare class KakaoStrategy extends KakaoStrategy_base {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void): Promise<void>;
    authorizationParams(options: any): any;
}
export {};
