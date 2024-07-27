import { Request, Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
export declare class AppController {
    private readonly appService;
    private readonly authService;
    constructor(appService: AppService, authService: AuthService);
    getHello(req: Request, redirect: string | undefined, url: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
