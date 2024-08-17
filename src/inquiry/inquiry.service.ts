import { Injectable } from '@nestjs/common';
import { Inquiry } from './entity/inquiry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { MetricService } from 'src/metric/metric.service';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
    private metricService: MetricService,
    private mailService: MailService,
  ) {}

  async createInquiry(responseObject, createInquiryDto) {
    // User object
    const { user_object } = createInquiryDto;
    if (user_object) {
      delete createInquiryDto.user_object;
    }
    // Create a new inquiry
    try {
      const inquiryObject = this.inquiryRepository.create(createInquiryDto);
      const inquiry = await this.inquiryRepository.save(inquiryObject);

      // If inquiry is created successfully
      if (inquiry && inquiry['uuid']) {
        // Send user object to metric service
        this.metricService.processInquiryUser(user_object, inquiry);
        // Prepare response object
        responseObject.status = true;
        responseObject.statusCode = 201;
        responseObject.message = 'Inquiry created successfully';
        responseObject.data = inquiry['uuid'];
        // Send confirmation email
        const emailObjectConfirmation = {
          from: 'support@ezvsx.com',
          to: inquiry['email'],
          subject: 'Luxiqx Inquiry Confirmation',
          text: 'We received your inquiry and will get back to you soon.',
        };
        const emailObjectNotify = {
          from: 'support@ezvsx.com',
          to: 'yuriy.myt@ezvsx.com',
          subject: 'New Inquiry',
          text:
            'Inquiry received. Please check the admin panel. Inquiry ID: ' +
            inquiry['uuid'],
        };
        this.mailService.sendEmail(emailObjectConfirmation, 'confirmation');
        this.mailService.sendEmail(emailObjectNotify, 'notify');
      } else {
        responseObject.message = 'Inquiry creation failed';
      }
    } catch (error) {
      responseObject.message = error.message;
      return responseObject;
    }

    return responseObject;
  }
}
