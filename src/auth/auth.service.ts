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
    const user = await this.validateUser(email, password);
    if (!user) {
      return false;
    }
    const payload = {
      sub: user.uuid,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      verified: user.verified,
      vip: user.vip,
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
      sub: decodedJwtPayload.uuid,
      first_name: decodedJwtPayload.first_name,
      last_name: decodedJwtPayload.last_name,
      username: decodedJwtPayload.username,
      email: decodedJwtPayload.email,
      verified: decodedJwtPayload.verified,
      vip: decodedJwtPayload.vip,
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
