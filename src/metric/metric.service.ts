import { Injectable } from '@nestjs/common';
import { UserFingerprint } from './entity/user-fingerprint.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FingerprintXEmail } from './entity/fingerprint_x_email.entity';
import { FingerprintXPhone } from './entity/fingerprint_x_phone.entity';

@Injectable()
export class MetricService {
  constructor(
    @InjectRepository(UserFingerprint)
    private fingerprintRepository: Repository<UserFingerprint>,
    @InjectRepository(FingerprintXEmail)
    private fingerprintXEmailRepository: Repository<FingerprintXEmail>,
    @InjectRepository(FingerprintXPhone)
    private fingerprintXPhoneRepository: Repository<FingerprintXPhone>,
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
  // Associate fingerprint with email and phone if they exist
  async processInquiryUser(userObject, inquiry): Promise<void> {
    // Decode user object json
    try {
      // Decoding user object
      const userObjectDecoded = JSON.parse(userObject);
      // User variables
      const userGaCode = userObjectDecoded.metadata.ga_code ?? null;
      const userIp = userObjectDecoded.metadata.ip_address ?? null;

      // Get all records which match the combination of ga_code 
      const userFingerprints = await this.fingerprintRepository.find({
        where: { ga_code: userGaCode },
      });
      // Get all records which match the combination of ip_address
      const userFingerprintsIp = await this.fingerprintRepository.find({
        where: { ip_address: userIp },
      });
      // Make an array of all the fingerprints uuids and filter out duplicates
      const userFingerprintsUuids = [
        ...new Set([
          ...userFingerprints.map((fingerprint) => fingerprint.uuid),
          ...userFingerprintsIp.map((fingerprint) => fingerprint.uuid),
        ]),
      ];
      // Inquiry variables
      const inquiryEmail = inquiry.email ?? null;
      const inquiryPhone = (inquiry.phone || '').replace(/\D/g, '') ?? null;

      // If inquiry has email make a record for each of the fingerprints uuids
      if (inquiryEmail) {
        userFingerprintsUuids.forEach(async (uuid) => {
          const fingerprintXEmail = this.fingerprintXEmailRepository.create({
            fingerprint_uuid: uuid,
            email: inquiryEmail,
          });
          await this.fingerprintXEmailRepository.save(fingerprintXEmail);
        });
      }
      // If inquiry has phone make a record for each of the fingerprints uuids
      if (inquiryPhone) {
        userFingerprintsUuids.forEach(async (uuid) => {
          const fingerprintXPhone = this.fingerprintXPhoneRepository.create({
            fingerprint_uuid: uuid,
            phone: inquiryPhone,
          });
          await this.fingerprintXPhoneRepository.save(fingerprintXPhone);
        });
      }
    } catch (error) {
      return;
    }
  }
}
