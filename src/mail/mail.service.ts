import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailLog } from './entity/email-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(EmailLog)
    private emailLogRepository: Repository<EmailLog>,
  ) {}

  async sendMail({
    to,
    subject,
    text,
    html,
    type,
  }: {
    to: string[];
    subject: string;
    text: string;
    html?: string;
    type?: string;
  }): Promise<any> {
    const toString = to.join(', ');
    let logCreated = false;
    try {
      const response = {
        success: false,
        emailSent: false,
        logCreated: logCreated,
        error: null,
      };
      const payload = {
        to: toString,
        from: 'luxiqx@gmail.com',
        subject: subject,
        text: text,
      };
      if (html) {
        payload['html'] = html;
      }
      const mailResponse = await this.mailerService.sendMail(payload);

      if (mailResponse) {
        logCreated = await this.createEmailLog(payload, type);
        response.success = true;
        response.emailSent = mailResponse.accepted.length > 0;
        response.logCreated = logCreated;
      } else {
        response.success = false;
        response.emailSent = false;
        response.logCreated = false;
      }
      return response;
    } catch (error) {
      return {
        success: false,
        emailSent: false,
        logCreated: false,
        error: error.message,
      };
    }
  }

  private async createEmailLog(payload, type) {
    try {
      const emailLog = new EmailLog();
      emailLog.to = payload.to;
      emailLog.subject = payload.subject;
      emailLog.text = payload.text;
      emailLog.html = payload?.html ?? '';
      emailLog.type = type;
      await this.emailLogRepository.save(emailLog);
      return true;
    } catch (error) {
      console.log('Error creating email log: ', error);
      return false;
    }
  }
}
