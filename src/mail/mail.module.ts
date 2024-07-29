import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailgunModule } from 'nestjs-mailgun';
import { EmailLog } from './entity/email-log.entity';
import { EmailLogType } from './entity/email-log-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLog, EmailLogType]),
    MailgunModule.forRoot({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
      // public_key: 'string', // OPTIONAL
      // timeout: 'number', // OPTIONAL, in milliseconds
      // url: 'string', // OPTIONAL, default: 'api.mailgun.net'. Note that if you are using the EU region the host should be set to 'api.eu.mailgun.net'
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
