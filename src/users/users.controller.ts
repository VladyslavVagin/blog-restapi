import {
  Controller,
  Get,
  Post,
  Ip,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Headers,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id/:optional?')
  public getUsers(@Param('id') id: any, @Query('limit') limit: any) {
    console.log(id);
    console.log(limit);
    return 'You send a GET request to /users endpoint';
  }

  @Post()
  public createUser(
    @Body() request: any,
    @Headers() headers: any,
    @Ip() ip: any,
  ) {
    console.log(request);
    console.log(headers);
    console.log(ip);
    return 'You send a POST request to /users endpoint';
  }
}
