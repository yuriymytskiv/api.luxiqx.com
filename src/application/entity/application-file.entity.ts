import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('application_files')
export class ApplicationFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  application_uuid: string;

  @Column({ nullable: false })
  file_url: string;

  @Column({ nullable: false })
  file_path: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['image', 'video', 'audio', 'document'],
  })
  file_type: string;

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
