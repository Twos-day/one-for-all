import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { SocialUserDto } from '../dto/social-user.dto';
import { GoogleProfile } from '../strategy/google.strategy';

export const GoogleUser = createParamDecorator(
  (data: keyof SocialUserDto | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const profile: GoogleProfile = req.user;

    if (!profile) {
      throw new InternalServerErrorException(
        'Request에 google profile이 존재하지 않습니다.',
      );
    }

    const googleUser: SocialUserDto = {
      email: profile.emails[0].value,
      nickname: profile.displayName,
      avatar: profile.photos[0].value,
      accessToken: profile.accessToken,
    };

    return data ? googleUser[data] : googleUser;
  },
);
