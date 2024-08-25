import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

/**Class to connect to Users table and perform business opearations */
@Injectable()
export class UsersService {
  constructor(
    /**Injecting usersRepository */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    /**Injecting profileConfiguration */
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    /** Inject usersCreateManyProvider */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
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
    //Create a new user
    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at the moment',
        { description: 'Error to connection to Database' },
      );
    }
    return newUser;
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
}
