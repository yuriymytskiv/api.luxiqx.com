import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('email_log_types')
export class EmailLogType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;
}
