import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestRefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MTcwMDhjZi04YmYwLTQ1ODEtYWI4ZS03YmU3NGMxZjA2MjMiLCJ1c2Vyfg44SI6IlRlc3QiLCJpYXQiOjE3MTk0MjI3NDEsImV4cCI6MTczNDk3NDc0MX0.9QWmsi9BWudv6qmm3m46Ce8LTqvNPiME82Ex62Y21nQ',
    description: 'This is refresh token field.',
  })
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken: string;
}
