import {
  Inject,
  Injectable,
  forwardRef,
  RequestTimeoutException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { UnauthorizedException } from '@nestjs/common';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    /** Inject usersService */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /** Inject hashingProvider */
    private readonly hashingProvider: HashingProvider,

    /** Inject generateTokensProvider */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // Find the user by email id
    // Throw the exceptions if the user is not found
    let user = await this.usersService.findOneByEmail(signInDto.email);

    // Compare password to the hash
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }

    // Generate tokens
    return await this.generateTokensProvider.generateTokens(user);
  }
}
