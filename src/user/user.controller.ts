import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { MailService } from '@/mail/mail.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // getAllUsers() {
  //   return this.usersService.getAllUsers();
  // }

  // @Post()
  // postUser(
  //   @Body('nickname') nickname: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.usersService.createUser({ nickname, email, password });
  // }
}
