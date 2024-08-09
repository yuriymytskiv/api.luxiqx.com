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

  @Column({ nullable: true })
  ga_code: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  signature: string;

  @Column({ nullable: true, length: 300 })
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
