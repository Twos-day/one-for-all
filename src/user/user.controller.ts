import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { MailService } from '@/mail/mail.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
