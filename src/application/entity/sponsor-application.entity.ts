import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sponsor_applications')
export class SponsorApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column({ nullable: false })
  company_name: string;

  @Column({ nullable: false })
  contact_name: string;

  @Column({ nullable: false })
  contact_email: string;

  @Column({ nullable: true, default: false, type: 'tinyint' })
  contact_email_verified: number;

  @Column({ nullable: false })
  contact_phone: string;

  @Column({ nullable: false })
  sponsorship_type: string;

  @Column({ nullable: false })
  sponsorship_description: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  })
  status: string;

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
}
