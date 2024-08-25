import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    /** Inject Datasource */
    private readonly dataSource: DataSource,
  ) {}

  /** Create many of users with one request */
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    let newUsers: User[] = [];
    // Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Connect Query Runner to datasource
      await queryRunner.connect();
      // Start Transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Cannot connect to Database');
    }

    try {
      for (let user of createManyUsersDto.users) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // If successful, commit transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // If failed, rollback transaction
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Cannot create users', {
        description: String(error),
      });
    } finally {
      try {
        // Release Query Runner
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException('Cannot release the connection', {
          description: String(error),
        });
      }
    }

    return newUsers;
  }
}
