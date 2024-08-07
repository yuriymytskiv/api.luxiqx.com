import { Body, Controller, Post } from '@nestjs/common';
import { MetricService } from './metric.service';
import { CreateUserFingerprintDto } from './dto/create-user-fingerprint.dto';

@Controller('metric')
export class MetricController {
  constructor(private metricService: MetricService) {}

  // Create Fingerprint
  @Post('/fingerprint')
  async createFingerprint(
    @Body() createUserFingerprintDto: CreateUserFingerprintDto,
  ) {
    return await this.metricService.createFingerprint(createUserFingerprintDto);
  }
}
