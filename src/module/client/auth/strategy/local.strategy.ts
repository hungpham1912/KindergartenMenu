import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {
  AuthUserStrategy,
  ResponseAuthUser,
} from 'src/module/core/auth/model/auth.model';
import { CliAuthService } from '../auth.service';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(
  Strategy,
  AuthUserStrategy.BASIC,
) {
  constructor(private readonly authService: CliAuthService) {
    super({
      usernameField: 'phone',
    });
  }

  async validate(phone: string, password: string): Promise<ResponseAuthUser> {
    return await this.authService.validateBasic(phone, password);
  }
}
