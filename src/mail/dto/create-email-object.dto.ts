import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateEmailObjectDto {
  @ApiProperty({
    description: 'The sender of the email',
    example: 'sender@example.com',
  })
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty({
    description: 'The recipient of the email',
    example: 'recipient@example.com',
  })
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({
    description: 'The subject of the email',
    example: 'Meeting Reminder',
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'The body text of the email',
    example: "Don't forget about the meeting tomorrow!",
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The HTML content of the email',
    example: "<p>Don't forget about the meeting tomorrow!</p>",
    required: false,
  })
  @IsOptional()
  @IsString()
  html?: string;

  @ApiProperty({
    description: 'Attachments of the email',
    example: 'base64encodedstring',
    required: false,
  })
  @IsOptional()
  @IsString()
  attachment?: string;

  @ApiProperty({
    description: 'CC addresses',
    example: 'cc@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  cc?: string;
}
