import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserModel } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from './const/status.const';
import { RegisterUserDto } from '@/auth/dto/register-user.dto';
import { UpdateUserDto } from '@/auth/dto/update-user.dto';
import { isAfter } from 'date-fns';
import { AccountType } from './const/account-type.const';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async getAllUsers() {
    const users = await this.usersRepository.find();
    return users;
  }

  async getUserById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async deleteUser(id: number) {
    return await this.usersRepository.update(id, {
      deletedAt: () => 'CURRENT_TIMESTAMP',
      status: StatusEnum.deactivated,
    });
  }

  async registerUser(dto: RegisterUserDto, accountType: AccountType) {
    const emailExists = await this.usersRepository.exists({
      where: { email: dto.email },
    });

    if (emailExists) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    const user = this.usersRepository.create({
      ...dto,
      accountType,
      status: StatusEnum.unauthorized,
    });

    return this.usersRepository.save(user);
  }

  async updateNewUser(dto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('가입되지 않은 사용자입니다.');
    }

    if (user.status !== StatusEnum.unauthorized) {
      throw new BadRequestException('이미 가입된 사용자입니다.');
    }

    if (user.verificationCode !== dto.verificationCode) {
      throw new BadRequestException('인증 코드가 일치하지 않습니다.');
    }

    if (isAfter(new Date(), user.expiresAt)) {
      throw new BadRequestException('인증 시간이 만료되었습니다.');
    }

    await this.usersRepository.update(user.id, {
      ...dto,
      status: StatusEnum.activated,
    });

    return { id: user.id };
  }

  async updateExistUser(dto: UpdateUserDto) {}

  async generateVerificationCode(id: number) {
    const findOne = await this.usersRepository.findOne({ where: { id } });

    if (!findOne) {
      throw new BadRequestException();
    }

    /** 6자리 숫자를 랜덤으로 생성 */
    const verificationCode = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    await this.usersRepository.update(findOne.id, {
      verificationCode,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30분 뒤 만료
    });

    return { email: findOne.email, code: verificationCode };
  }
}
