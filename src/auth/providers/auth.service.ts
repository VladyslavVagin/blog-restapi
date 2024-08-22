import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
    ) {}
  public login(email: string, password: string, id: string) {
    const user = this.usersService.findOneById('12345');
    //login
    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}
