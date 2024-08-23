import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

/**Class to connect to Users table and perform business opearations */
@Injectable()
export class UsersService {
  constructor(
    /**Injecting usersRepository */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**Create a new User method */
  public async createUser(createUserDto: CreateUserDto) {
    // Check if the user already exists with the same email
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    //Handle exceptions

    //Create a new user
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }

  /**The method to get all the users from database */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
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

  /**Find a single user using the ID of the user */
  public findOneById(id: string) {
    return {
      id: 12345,
      firstName: 'Jane',
      email: 'jain@gmail.com',
    };
  }
}
