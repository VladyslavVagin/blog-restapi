import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';

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

    /**Inject tagsService */
    private readonly tagsService: TagsService,
  ) {}

  /**Creating new posts */
  public async create(@Body() createPostDto: CreatePostDto) {
   // Find author from database based on authorId
    let author = await this.usersService.findOneById(createPostDto.authorId);

    // Find tags from database based on tagIds
    let tags = await this.tagsService.findMultipleTags(createPostDto.tags);

    //Create post
    let post = this.postsRepository.create({
      ...createPostDto,
      author,
      tags,
    });
    //return the post
    return await this.postsRepository.save(post);
  }

  /**Get all posts */
  public async findAll(userId: string) {
    let posts = await this.postsRepository.find({
      relations: { metaOptions: true, author: true, tags: true },
    });
    return posts;
  }

 /** Delete post */
 public async delete(id: number) {
  // Deleting post
  await this.postsRepository.delete(id);
  // Confirmation message
  return { deleted: true, id };
 }
}
