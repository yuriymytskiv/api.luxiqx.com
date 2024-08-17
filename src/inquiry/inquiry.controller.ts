import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { GlobalService } from 'src/global/global.service';
import { Throttle } from '@nestjs/throttler';

@Controller('inquire')
export class InquiryController {
  constructor(
    private globalService: GlobalService,
    private inquiryService: InquiryService,
  ) {}

  // Create Inquiry
  @Throttle({ default: { limit: 2, ttl: 240000 } })
  @Post('')
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
