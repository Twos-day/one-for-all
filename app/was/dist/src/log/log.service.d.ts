import { ConfigService } from '@nestjs/config';
export declare class LogService {
    private readonly configService;
    constructor(configService: ConfigService);
    sendDiscode(message: string, mention?: string): Promise<void>;
}
