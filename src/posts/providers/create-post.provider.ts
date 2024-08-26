import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class CreatePostProvider {
  constructor(
    /**Injecting usersService */
    private readonly usersService: UsersService,
    /**Inject postsRepository */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    /**Inject tagsService */
    private readonly tagsService: TagsService,
  ) {}

  /**Creating new posts */
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author = undefined;
    let tags = undefined;

    try {
      // Find author from database based on authorId
      author = await this.usersService.findOneById(user.sub);

      // Find tags from database based on tagIds
      tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags.length !== tags.length) {
      throw new BadRequestException('Some tags do not exist');
    }

    //Create post
    let post = this.postsRepository.create({
      ...createPostDto,
      author,
      tags,
    });

    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure Post slug is unique and not a duplicate',
      });
    }
  }
}
