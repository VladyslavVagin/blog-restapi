import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    /**Injecting usersService */
    private readonly usersService: UsersService,
    /**Inject postsRepository */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    /**Inject metaOptionsRepository */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  /**Creating new posts */
  public async create(@Body() createPostDto: CreatePostDto) {
    //Create post
    let post = this.postsRepository.create(createPostDto);
    //return the post
    return await this.postsRepository.save(post);
  }

  /**Get all posts */
  public async findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    let posts = await this.postsRepository.find({
      relations: { metaOptions: true },
    });
    return posts;
  }

 /** Delete post */
 public async delete(id: number) {
  // Find the post
  let post = await this.postsRepository.findOneBy({ id });
  // Deleting post
  await this.postsRepository.delete(id);
  // Delete mate options
  await this.metaOptionsRepository.delete(post.metaOptions.id);
  // Confirmation message
  return { deleted: true, id };
 }
}
