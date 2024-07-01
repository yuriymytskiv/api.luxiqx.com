import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'joe',
    description: 'First name must be between 2 and 20 characters long.',
  })
  @IsString({ message: 'First name must be a string.' })
  @MinLength(2)
  @MaxLength(20)
  readonly first_name: string;

  @ApiProperty({
    example: 'doe',
    description: 'Last name must be between 2 and 20 characters long.',
  })
  @IsString({ message: 'Last name must be a string.' })
  @MinLength(2)
  @MaxLength(20)
  readonly last_name: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username between 4 and 40 characters long.',
  })
  @IsString({ message: 'Username must be a string.' })
  @MinLength(4)
  @MaxLength(40)
  readonly username: string;

  @ApiProperty({
    example: 'joedoe@gmail.com',
    description: 'Email must be a valid email string.',
  })
  @IsEmail({}, { message: 'Email must be a valid email string.' })
  readonly email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Password between 4 and 40 characters long with at least one uppercase letter, one lowercase letter.',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(40)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak.',
  })
  password: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password confirmation that must match the password field.',
  })
  @IsString({ message: 'Password confirmation is required.' })
  passwordConfirm: string;
}
