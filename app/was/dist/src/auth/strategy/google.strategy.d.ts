import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
export interface GoogleProfile extends Profile {
    accessToken: string;
    refreshToken: string;
}
declare const GoogleStrategy_base: new (...args: any[]) => InstanceType<typeof Strategy>;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void>;
    authorizationParams(options: any): any;
}
export {};
