import { Body, Controller, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { GlobalService } from 'src/global/global.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private globalService: GlobalService,
    private userService: UserService,
  ) {}

  @Post('/')
  async createUser(
    @Req() request: Request,
    @Body() createUserDto: CreateUserDto,
    @Query('master_password') masterPassword: string,
  ) {
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );
    // Check master password in headers as master_password
    if (
      !process.env.USER_CREATION ||
      masterPassword !== process.env.MASTER_PASSWORD
    ) {
      responseObject.statusCode = 401;
      responseObject.message = 'Unauthorized';
      return responseObject;
    }

    return this.userService.create(createUserDto, responseObject);
  }
}
