import { getServerUrl } from '@/common/util/getServerUrl';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

export interface GoogleProfile extends Profile {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    const callbackURL = `${getServerUrl()}/api/auth/callback/google`;
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const googleProfile: GoogleProfile = {
      ...profile,
      accessToken,
      refreshToken,
    };

    done(null, googleProfile);
  }

  authorizationParams(options: any) {
    return { ...options, prompt: 'select_account' };
  }
}
