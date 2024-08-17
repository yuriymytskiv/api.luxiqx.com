import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserFingerprintDto {
  @ApiProperty({
    description: 'Google Analytics code',
    example: 'UA-12345678-1',
  })
  @IsString()
  @IsNotEmpty()
  ga_code: string;

  @ApiProperty({
    description: 'IP address associated with the fingerprint',
    example: '192.168.1.1',
  })
  @IsString()
  @IsNotEmpty()
  ip_address: string;

  @ApiProperty({
    description: 'Signature associated with the fingerprint',
    example: 'unique-signature',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({
    description: 'Device information (optional)',
    example: 'iPhone 12',
    required: false,
  })
  @IsOptional()
  @IsString()
  device_info?: string;
}
