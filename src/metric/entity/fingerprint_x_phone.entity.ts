import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('fingerprint_x_phone')
@Unique(['fingerprint_uuid', 'phone'])
export class FingerprintXPhone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fingerprint_uuid: string;

  @Column({ nullable: false })
  phone: string;
}
