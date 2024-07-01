import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RequestRefreshTokenDto } from './dto/request-refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  // Validate account function // This is whats used by passport. Don't change this unless you know what you are doing.
  async validateUser(email, pass): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Gain JWT token
  async requestToken(email: string, password: string) {
    const account = await this.validateAccount(email, password);
    if (!account) {
      return false;
    }
    const payload = {
      sub: account.uuid,
      username: account.username,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '30d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '180d',
      }),
    };
  }
  // Gain JWT token
  async requestRefreshToken(requestRefreshTokenDto: RequestRefreshTokenDto) {
    const valid = this.jwtService.verify(requestRefreshTokenDto.refreshToken);
    if (!valid) {
      return false;
    }
    const decodedJwtPayload = this.jwtService.decode(
      requestRefreshTokenDto.refreshToken,
    );
    const payload = {
      sub: decodedJwtPayload.sub,
      username: decodedJwtPayload.username,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '30d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '180d',
      }),
    };
  }
}
