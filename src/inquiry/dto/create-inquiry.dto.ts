import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Length,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateInquiryDto {
  @ApiProperty({
    description: 'Name of the person making the inquiry',
    example: 'John Doe',
  })
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Company of the person making the inquiry',
    example: 'Acme Corp',
  })
  @IsString()
  @Length(1, 255)
  company: string;

  @ApiProperty({
    description: 'Email address of the person making the inquiry',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number of the person making the inquiry',
    example: '+1234567890',
  })
  @IsString()
  @Length(1, 20)
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Subject of the inquiry',
    example: 'Product Inquiry',
  })
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Message content of the inquiry',
    example: 'I would like more information about your product.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'User metrics related to the inquiry in JSON string format',
    type: 'string',
    example: '{"pageViews": 123, "sessionDuration": 45}', // Example JSON string
    required: false,
  })
  @IsOptional()
  @IsString()
  user_object?: string;
}
