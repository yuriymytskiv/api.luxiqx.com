import { Body, Controller, Post } from '@nestjs/common';
import { MetricService } from './metric.service';
import { CreateUserFingerprintDto } from './dto/create-user-fingerprint.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('metric')
export class MetricController {
  constructor(private metricService: MetricService) {}

  // Create Fingerprint
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('/fingerprint')
  async createFingerprint(
    @Body() createUserFingerprintDto: CreateUserFingerprintDto,
  ) {
    return await this.metricService.createFingerprint(createUserFingerprintDto);
  }
}
