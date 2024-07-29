import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateSponsorApplicationDto {
  @ApiProperty({
    description: 'Company name of the sponsor',
    example: 'Acme Corp',
  })
  @IsString()
  company_name: string;

  @ApiProperty({
    description: 'Contact name for the sponsor application',
    example: 'John Doe',
  })
  @IsString()
  contact_name: string;

  @ApiProperty({
    description: 'Contact email for the sponsor application',
    example: 'john.doe@acme.com',
  })
  @IsEmail()
  contact_email: string;

  @ApiProperty({
    description: 'Contact phone number for the sponsor application',
    example: '+1234567890',
  })
  @IsPhoneNumber(null)
  contact_phone: string;

  @ApiProperty({
    description: 'Type of sponsorship',
    example: 'Gold',
  })
  @IsString()
  sponsorship_type: string;

  @ApiProperty({
    description: 'Description of the sponsorship',
    example: 'This is a description of the sponsorship provided by Acme Corp.',
  })
  @IsString()
  sponsorship_description: string;

  @ApiProperty({
    description: 'Status of the sponsor application',
    example: 'Pending',
    enum: ['Pending', 'Approved', 'Rejected'],
  })
  @IsEnum(['Pending', 'Approved', 'Rejected'])
  status: string;

  @ApiProperty({
    description: 'Whether the contact email has been verified',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  contact_email_verified?: boolean;
}
