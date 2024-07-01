import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestTokenDto {
  @ApiProperty({
    example: 'username123',
    description: 'This is username field.',
  })
  @IsString({ message: 'Username must be a string' })
  username: string;
  @ApiProperty({
    example: 'Password123!example',
    description: 'This is the password field.',
  })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
