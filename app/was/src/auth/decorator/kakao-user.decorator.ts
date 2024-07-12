import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { SocialUserDto } from '../dto/social-user.dto';
import { KakaoProfile } from '../strategy/kakao.strategy';

export const KakaoUser = createParamDecorator(
  (data: keyof SocialUserDto | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const profile: KakaoProfile = req.user;

    if (!profile) {
      throw new InternalServerErrorException(
        'Request에 kakao profile이 존재하지 않습니다.',
      );
    }

    const kakaoUser: SocialUserDto = {
      nickname: profile.username,
      email: profile._json.kakao_account.email,
      accessToken: profile.accessToken,
      avatar: profile._json.properties.thumbnail_image,
    };

    return data ? kakaoUser[data] : kakaoUser;
  },
);
