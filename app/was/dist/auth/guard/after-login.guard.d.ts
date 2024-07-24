import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
export declare class AccessGuard implements CanActivate {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class SessoionUserGuard implements CanActivate {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UserService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
