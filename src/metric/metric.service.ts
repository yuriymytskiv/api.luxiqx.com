import { Injectable } from '@nestjs/common';
import { UserFingerprint } from './entity/user-fingerprint.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MetricService {
  constructor(
    @InjectRepository(UserFingerprint)
    private fingerprintRepository: Repository<UserFingerprint>,
  ) {}
  // Post Metrics
  async createFingerprint(createUserFingerprintDto): Promise<boolean> {
    try {
      const fingerprint = this.fingerprintRepository.create(
        createUserFingerprintDto,
      );
      await this.fingerprintRepository.save(fingerprint);
      return true;
    } catch (error) {
      return false;
    }
  }
}
