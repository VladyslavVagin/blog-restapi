import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/google-user.interface';

/**Class to connect to Users table and perform business opearations */
@Injectable()
export class UsersService {
  constructor(
    /**Injecting usersRepository */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    /** Inject usersCreateManyProvider */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    /** Inject createUserProvider */
    private readonly createUserProvider: CreateUserProvider,

    /** Inject findOneUserByEmailProvider */
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,

    /** Inject findOneByGoogleIdProvider */
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,

    /** Inject createGoogleUserProvider */
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  /**Create a new User method */
  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
  }

  /**The method to get all the users from database */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'API endpoint does not exist',
        fileName: 'users.service.ts',
        lineNumber: 88,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured because the API endpoint does not exist',
      },
    );
  }

  /**Find a single user using the ID of the user */
  public async findOneById(id: number) {
    let user = undefined;

    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at the moment',
        { description: 'Error to connection to Database' },
      );
    }
    /** Handle that user does not exist */
    if (!user) {
      throw new BadRequestException('The User ID does not exist');
    }

    return user;
  }

    /** Create many of users with one request */
    public async createMany(createManyUsersDto: CreateManyUsersDto) {
      return this.usersCreateManyProvider.createMany(createManyUsersDto);
    }

    public async findOneByEmail(email: string) {
     return this.findOneUserByEmailProvider.findOneByEmail(email);
    }

    public async findOneByGoogleId(googleId: string) {
     return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
    }

    public async createGoogleUser(googleUser: GoogleUser) {
      return await this.createGoogleUserProvider.createGoogleUser(googleUser);
    }
}
