import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Find user by uuid
  async findByUuid(uuid: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ uuid: uuid }],
    });
  }

  // Find user by username
  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ username: username }],
    });
  }

  // Find user by email
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: [{ email: email }],
    });
  }

  // Create user
  async create(userData: CreateUserDto, responseObject: any): Promise<any> {
    // User
    let user: UserResponseDto;
    // Check if passwords are the same
    const passwordNoMatch = userData.password !== userData.password_confirm;
    // Check if the email is in use or not
    const existingUser = await this.userRepository.findOne({
      where: [{ username: userData.username }],
    });
    if (passwordNoMatch) {
      responseObject.errors.push('Passwords do not match.');
    } else if (existingUser) {
      responseObject.errors.push('User with the same email exists.');
    } else {
      // Password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
      delete userData.password_confirm;
      // Saving user
      user = this.userRepository.create(userData);
      await this.userRepository.save(user);

      const payload = {
        sub: user.uuid,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        verified: user.verified,
        vip: user.vip,
      };

      const tokens = {
        access_token: this.jwtService.sign(payload, {
          expiresIn: process.env.JWT_EXPIRATION,
        }),
        refresh_token: this.jwtService.sign(payload, {
          expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        }),
        expires_in: process.env.JWT_EXPIRATION_TIME,
      };

      if (user) {
        responseObject.data['user'] = plainToClass(UserResponseDto, user); // Transforming to response dto
        responseObject.status = true;
        responseObject.statusCode = 201;
        responseObject.message = 'User created successfully.';
        responseObject.data['tokens'] = tokens;
      }
    }
    return responseObject;
  }
}
