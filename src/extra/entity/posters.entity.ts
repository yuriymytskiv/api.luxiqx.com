import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posters')
export class Poster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  file_url: string;

  @Column({ nullable: false })
  file_path: string;

  @Column({ nullable: false, length: 50 })
  file_mime: string;

  @Column({ nullable: false, type: 'integer' })
  file_size: number;

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
