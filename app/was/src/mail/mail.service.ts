import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { template } from './template/verification-code.template';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  async sendVerificationCode(email: string, code: string) {
    const user = this.configService.get('NAVER_USER');

    const transporter = nodemailer.createTransport({
      service: 'naver',
      auth: {
        user,
        pass: this.configService.get('NAVER_PASSWORD'),
      },
    });

    const mailOptions = await transporter.sendMail({
      from: user,
      to: email,
      subject: 'Verification Code',
      html: template(code),
    });

    return mailOptions;
  }
}
