import { IsArray, IsEmail, IsString } from 'class-validator';

export class SendMailDto {
  @IsArray()
  @IsEmail({}, { each: true })
  to: string[];

  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsString()
  html: string;
}
