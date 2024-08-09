import { Body, Controller, Req } from '@nestjs/common';
import { Request } from 'express';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { GlobalService } from 'src/global/global.service';

@Controller('inquire')
export class InquiryController {
  constructor(
    private globalService: GlobalService,
    private inquiryService: InquiryService,
  ) {}

  // Create Inquiry
  async createInquiry(
    @Req() request: Request,
    @Body() createInquiryDto: CreateInquiryDto,
  ) {
    // Create response object
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );

    // Create Inquiry
    return await this.inquiryService.createInquiry(
      responseObject,
      createInquiryDto,
    );
  }
}
