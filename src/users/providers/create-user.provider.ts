import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    /** Inject usersRepository */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    /** Inject hashingProvider */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    /** Inject mailService */
    private readonly mailService: MailService,
  ) {}

  /**Create a new User method */
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;

    try {
      // Check if the user already exists with the same email
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at the moment',
        { description: 'Error to connection to Database' },
      );
    }
    //Handle exceptions
    if (existingUser) {
      throw new BadRequestException('User already exists with the same email');
    }

    // Create a new user
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at the moment. Cannot save new User.',
        { description: 'Error to connection to Database' },
      );
    }

    try {
      await this.mailService.sendUserWelcome(newUser);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    return newUser;
  }
}
