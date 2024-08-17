import { Module } from '@nestjs/common';
import { MetricService } from './metric.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFingerprint } from './entity/user-fingerprint.entity';
import { UserXFingerprint } from './entity/user_x_fingerprint.entity';
import { FingerprintXEmail } from './entity/fingerprint_x_email.entity';
import { FingerprintXPhone } from './entity/fingerprint_x_phone.entity';
import { MetricController } from './metric.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserFingerprint,
      UserXFingerprint,
      FingerprintXEmail,
      FingerprintXPhone,
    ]),
  ],
  providers: [MetricService],
  controllers: [MetricController],
  exports: [MetricService],
})
export class MetricModule {}
