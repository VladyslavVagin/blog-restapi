import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.service';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

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

    /** Injecting paginationProvider */
    private readonly paginationProvider: PaginationProvider
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
  public async findAll(postQuery: GetPostsDto ,userId: string): Promise<Paginated<Post>> {
    let posts = await this.paginationProvider.paginateQuery({
      limit: postQuery.limit,
      page: postQuery.page
    }, this.postsRepository);
    return posts;
  }

  /** Delete post */
  public async delete(id: number) {
    // Deleting post
    await this.postsRepository.delete(id);
    // Confirmation message
    return { deleted: true, id };
  }

  /** Update post */
  public async update(patchPostDto: PatchPostDto) {
    let tags = undefined;
    let post = undefined;
    // Find the tags
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at the moment',
      );
    }

    /** Number of tags should be equal */
    if (!tags || tags.length !== patchPostDto.tags.length) {
      throw new BadRequestException(
        'Please check your tags IDs and ensure they are correct',
      );
    }
    // Find the post
    try {
      post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at the moment',
      );
    }

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    // Update the post
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // Assign new tags
    post.tags = tags;
    // Save ant return the post
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at the moment',
      );
    }
    return post;
  }
}
