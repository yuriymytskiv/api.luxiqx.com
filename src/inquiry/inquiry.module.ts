import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from './entity/inquiry.entity';
import { GlobalModule } from 'src/global/global.module';
import { MetricModule } from 'src/metric/metric.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    GlobalModule,
    MetricModule,
    MailModule,
    TypeOrmModule.forFeature([Inquiry]),
  ],
  providers: [InquiryService],
  controllers: [InquiryController],
})
export class InquiryModule {}
