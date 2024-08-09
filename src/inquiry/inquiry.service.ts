import { Injectable } from '@nestjs/common';
import { Inquiry } from './entity/inquiry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
  ) {}

  async createInquiry(responseObject, createInquiryDto) {
    // Create a new inquiry
    return responseObject;
  }
}
