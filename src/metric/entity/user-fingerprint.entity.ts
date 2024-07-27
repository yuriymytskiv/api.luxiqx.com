import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  BeforeInsert,
} from 'typeorm';

import { v4 as uuidv4 } from 'uuid';

@Entity('user_fingerprints')
@Unique(['ga_code', 'ip']) // Define composite unique constraint
export class UserFingerprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column({ nullable: false })
  ga_code: string;

  @Column({ nullable: false })
  ip: string;

  @Column({ unique: true, nullable: false })
  signature: string;

  @Column({ nullable: true })
  device_info: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }
}