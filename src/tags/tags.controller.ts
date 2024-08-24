import { Body, Controller, Post, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tags')
export class TagsController {
  constructor(
    /**Inject tagsService */
    private readonly tagsService: TagsService,
  ) {}

  /**Create a new tag */
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
  })
  @Post()
  public create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  /** Delete tag */
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully deleted.',
  })
  @Delete()
  public async delete (@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.delete(id);
  }

  /** Soft delete of tag */
  @ApiOperation({ summary: 'Soft delete a tag' })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully soft deleted.',
  })
  @Delete('soft-delete') // /tags/soft-delete
  public async softDelete (@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.softRemove(id);
  }
}
