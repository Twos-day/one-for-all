import { UserService } from '@/user/user.service';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
export declare class BasicTokenGuard implements CanActivate {
    private readonly authService;
    constructor(authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class SignupSessionGuard implements CanActivate {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class SignupAccessGuard implements CanActivate {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class PublicAccessGuard implements CanActivate {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
