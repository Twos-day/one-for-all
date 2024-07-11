import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LogService {
  constructor(private readonly configService: ConfigService) {}

  async sendDiscode(message: string, mention?: string) {
    const content = mention ? `${mention} ${message}` : message;
    const res = await fetch(this.configService.get('DISCORD_WEBHOOK_URL'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      Logger.error('디스코드 웹훅 전송 실패');
      Logger.error(await res.text());
    }
  }
}
