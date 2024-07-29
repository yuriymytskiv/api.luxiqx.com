import { Injectable } from '@nestjs/common';
import { MailgunService } from 'nestjs-mailgun';
import { CreateEmailObjectDto } from './dto/create-email-object.dto';
import { EmailLog } from './entity/email-log.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MailService {
  private readonly mailgunDomain;
  constructor(
    @InjectRepository(EmailLog)
    private emailLogRepository: Repository<EmailLog>,
    private mailgunService: MailgunService,
  ) {
    this.mailgunDomain = process.env.MAILGUN_DOMAIN;
  }

  // Validate Email
  async validateEmail(email: string): Promise<any> {
    const response = await this.mailgunService.validateEmail(email);
    console.log('Email Validation : ' + email + ' ', response);
    return response;
  }
  // Send Email
  async sendEmail(
    createEmailObjectDto: CreateEmailObjectDto,
    type: string,
  ): Promise<{ emailSent: boolean; logCreated: boolean }> {
    const emailObject = {
      from: createEmailObjectDto.from,
      to: createEmailObjectDto.to,
      subject: createEmailObjectDto.subject,
      text: createEmailObjectDto.text,
      html: createEmailObjectDto.html,
      attachment: createEmailObjectDto.attachment,
      cc: createEmailObjectDto.cc,
    };

    let emailSent = false;
    let logCreated = false;

    try {
      // Send email
      const response = await this.mailgunService.createEmail(
        this.mailgunDomain,
        emailObject,
      );

      // If email is sent successfully
      if (response.status === 200) {
        emailSent = true;

        // Create email log
        emailObject['type'] = type;
        const emailLog = this.emailLogRepository.create(emailObject);
        await this.emailLogRepository.save(emailLog);

        logCreated = true;
      }
    } catch (error) {
      console.log('Error in sending email: ', error);
    }

    return { emailSent, logCreated };
  }
}
