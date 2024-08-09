import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('fingerprint_x_email')
@Unique(['fingerprint_uuid', 'email'])
export class FingerprintXEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fingerprint_uuid: string;

  @Column({ nullable: false })
  email: string;
}
