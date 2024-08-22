import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    return [
      {
        firstName: 'John',
        email: 'joe@gmail.com',
      },
      {
        firstName: 'Jane',
        email: 'jain@gmail.com',
      },
    ];
  }

  public findOneById(id: string) {
    return {
      id: 12345,
      firstName: 'Jane',
      email: 'jain@gmail.com',
    };
  }
}
