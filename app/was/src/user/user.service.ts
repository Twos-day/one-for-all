import {
  PatchEmailUserDto,
  PostEmailUserDto,
  PostVerificationDto,
} from '@/auth/dto/email-user.dto';
import { PatchSocialUserDto, SocialUserDto } from '@/auth/dto/social-user.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEnum } from './const/status.const';
import { UserModel } from './entities/user.entity';
import { isAfter } from 'date-fns';
import { AccountType } from './const/account-type.const';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async getUserById(id: number): Promise<UserModel | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<UserModel | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async deleteUser(id: number) {
    return await this.usersRepository.update(id, {
      deletedAt: () => 'CURRENT_TIMESTAMP',
      status: StatusEnum.deactivated,
    });
  }

  async registerUser(dto: PostEmailUserDto | SocialUserDto) {
    const newUser = this.usersRepository.create({
      email: dto.email,
      nickname: dto.email.split('@')[0],
      status: StatusEnum.unauthorized,
    });

    return await this.usersRepository.save(newUser);
  }

  async patchUser(
    user: UserModel,
    dto: PatchEmailUserDto | PatchSocialUserDto,
    accountType: AccountType,
  ) {
    const updatedUser = {
      ...user,
      ...dto,
      accountType,
      status: StatusEnum.activated,
    };

    const result = await this.usersRepository.save(updatedUser);

    return result;
  }

  async generateVerificationCode(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    if (user.status === StatusEnum.deactivated) {
      throw new ForbiddenException('접근이 제한된 사용자입니다.');
    }

    /** 6자리 숫자를 랜덤으로 생성 */
    const verificationCode = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    await this.usersRepository.update(user.id, {
      verificationCode,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30분 뒤 만료
    });

    return { email: user.email, code: verificationCode };
  }

  async checkVerificationCode(dto: PostVerificationDto) {
    const user = await this.usersRepository.findOne({
      where: { id: dto.id, email: dto.email, verificationCode: dto.code },
    });

    if (!user) {
      throw new BadRequestException('인증번호가 일치하지 않습니다.');
    }

    if (!user.expiresAt || isAfter(new Date(), user.expiresAt)) {
      throw new ForbiddenException('인증번호가 만료되었습니다.');
    }

    await this.usersRepository.update(dto.id, { expiresAt: null });

    return user;
  }
}
