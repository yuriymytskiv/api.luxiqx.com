import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { GlobalService } from 'src/global/global.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private globalService: GlobalService,
    private userService: UserService,
  ) {}

  @ApiOkResponse({
    description: 'User created successfully.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        path: { type: 'string', example: '/user' },
        message: { type: 'string', example: 'User created successfully.' },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
        data: { type: 'object', example: {} },
      },
    },
  })
  @Post('/')
  async createUser(
    @Req() request: Request,
    @Body() createUserDto: CreateUserDto,
  ) {
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );
    return this.userService.create(createUserDto, responseObject);
  }
}
