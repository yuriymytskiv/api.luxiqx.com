import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Length,
  IsArray,
  IsObject,
} from 'class-validator';

export class FileMetadataDto {
  @ApiProperty({
    description: 'The original name of the file',
    example: 'photo.jpg',
  })
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty({
    description: 'The mime type of the file',
    example: 'image/jpeg',
  })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({
    description: 'The size of the file in bytes',
    example: 1024,
  })
  @IsString()
  @IsNotEmpty()
  size: number;
}

export class CreateModelApplicationDto {
  @ApiProperty({
    description: 'First name of the applicant',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Last name of the applicant',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Email of the applicant',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number of the applicant',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Age of the applicant',
    example: 25,
  })
  @IsString()
  @IsNotEmpty()
  age: string;

  @ApiProperty({
    description: 'Ethnicity of the applicant',
    example: 'Asian',
  })
  @IsString()
  @IsNotEmpty()
  ethnicity: string;

  @ApiProperty({
    description: 'Self-description of the applicant',
    example: 'I am a passionate individual...',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  self_description: string;

  @ApiProperty({
    description: 'Interest description of the applicant',
    example: 'I am interested in...',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  interest_description: string;

  @ApiProperty({
    description: 'Height of the applicant',
    example: '180cm',
    required: false,
  })
  @IsOptional()
  @IsString()
  height?: string;

  @ApiProperty({
    description: 'Weight of the applicant',
    example: '75kg',
    required: false,
  })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiProperty({
    description: 'Hair color of the applicant',
    example: 'Black',
    required: false,
  })
  @IsOptional()
  @IsString()
  hair_color?: string;

  @ApiProperty({
    description: 'Eye color of the applicant',
    example: 'Brown',
    required: false,
  })
  @IsOptional()
  @IsString()
  eye_color?: string;

  @ApiProperty({
    description: 'Instagram handle of the applicant',
    example: '@john_doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({
    description: 'Facebook handle of the applicant',
    example: 'facebook.com/johndoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty({
    description: 'OnlyFans handle of the applicant',
    example: 'onlyfans.com/johndoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  onlyfans?: string;

  @ApiProperty({
    description: 'Other link related to the applicant',
    example: 'example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  other_link?: string;

  @ApiProperty({
    description: 'Metadata of files uploaded by the applicant',
    type: [FileMetadataDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  file_metadata?: FileMetadataDto[];
}
