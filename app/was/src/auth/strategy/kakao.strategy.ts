import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
import { getServerUrl } from '@/common/util/getServerUrl';

export interface KakaoProfile extends Profile {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    const callbackURL = `${getServerUrl()}/api/auth/callback/kakao`;
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    const KakaoProfile = {
      ...profile,
      accessToken,
      refreshToken,
    };
    done(null, KakaoProfile);
  }

  authorizationParams(options: any) {
    // https://stackoverflow.com/questions/62268243/passport-google-oauth2-not-prompting-select-account-when-only-1-google-account-l
    return { ...options, prompt: 'select_account' };
  }
}
