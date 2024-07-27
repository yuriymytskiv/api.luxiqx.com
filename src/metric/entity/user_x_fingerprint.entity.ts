import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('user_x_fingerprint')
@Unique(['user_uuid', 'fingerprint_uuid']) // Define composite unique constraint
export class UserXFingerprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  user_uuid: string;

  @Column({ nullable: true })
  fingerprint_uuid: string;
}
