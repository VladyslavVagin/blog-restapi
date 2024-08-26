import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    /** Injecting usersService */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /** Inject signInProvider */
    private readonly signInProvider: SignInProvider,

    /** Inject refreshTokensProvider */
    private readonly refreshTokensProvider: RefreshTokensProvider,
    ) {}

  /** Login user */
  public async signIn(signInDto: SignInDto) {
   return await this.signInProvider.signIn(signInDto);
  }

  public async refreshTokens(refreshTokensDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokensDto);
  }
}
