import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly configService;
    constructor(configService: ConfigService);
    sendVerificationCode(email: string, code: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
