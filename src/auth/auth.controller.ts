import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RequestTokenDto } from './dto/request-token.dto';
import { RequestRefreshTokenDto } from './dto/request-refresh-token.dto';
import { GlobalService } from 'src/global/global.service';

@Controller('auth')
export class AuthController {
  constructor(
    private globalService: GlobalService,
    private authService: AuthService,
  ) {}

  @Post('/token')
  async requestToken(
    @Req() request: Request,
    @Body() requestTokenDto: RequestTokenDto,
  ) {
    // Creating response object
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );
    const tokens = await this.authService.requestToken(
      requestTokenDto.username,
      requestTokenDto.password,
    );
    if (tokens) {
      responseObject.status = true;
      responseObject.statusCode = 200;
      responseObject.message = 'Tokens successfully generated';
      responseObject.data['tokens'] = tokens;
    } else {
      responseObject.statusCode = 401;
      responseObject.message = 'Invalid credentials';
    }
    return responseObject;
  }

  @Post('/refresh-token')
  async refreshToken(
    @Req() request: Request,
    @Body() requestRefreshTokenDto: RequestRefreshTokenDto,
  ) {
    // Creating response object
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );
    const tokens = await this.authService.requestRefreshToken(
      requestRefreshTokenDto,
    );
    if (tokens) {
      responseObject.status = true;
      responseObject.statusCode = 200;
      responseObject.message = 'Tokens successfully generated';
      responseObject.data['tokens'] = tokens;
    } else {
      responseObject.statusCode = 401;
      responseObject.message = 'Invalid credentials';
    }
    return responseObject;
  }
}
