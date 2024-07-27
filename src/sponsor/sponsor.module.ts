import { Module } from '@nestjs/common';
import { SponsorService } from './sponsor.service';

@Module({
  providers: [SponsorService]
})
export class SponsorModule {}
