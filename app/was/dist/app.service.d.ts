import { AuthService } from './auth/auth.service';
export declare class AppService {
    private readonly authService;
    constructor(authService: AuthService);
    checkRedirect(redirect?: string): boolean;
}
