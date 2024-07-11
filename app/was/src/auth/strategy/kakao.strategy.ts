import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const protocol = configService.get('PROTOCOL');
    const host = configService.get('HOST');
    const callbackURL = `${protocol}://${host}/api/auth/callback/kakao`;
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      clientSecret: configService.get('KAKAO_CLIENT_SECRET'),
      callbackURL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    console.log(profile);
    const { id, username, _json } = profile;
    const user = {
      kakaoId: id,
      nickname: username,
      email: _json.kakao_account.email,
      accessToken,
      picture: _json.properties.thumbnail_image,
    };
    done(null, user);
  }
}
