import { Module } from '@nestjs/common';
import { MetricService } from './metric.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFingerprint } from './entity/user-fingerprint.entity';
import { UserXFingerprint } from './entity/user_x_fingerprint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserFingerprint, UserXFingerprint])],
  providers: [MetricService],
})
export class MetricModule {}
