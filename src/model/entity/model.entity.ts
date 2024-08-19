import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('models')
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false, type: 'tinyint' })
  age: number;

  @Column({ nullable: false })
  ethnicity: string;

  @Column({ nullable: false, type: 'varchar', length: 1000 })
  self_description: string;

  @Column({ nullable: true })
  height: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  hair_color: string;

  @Column({ nullable: true })
  eye_color: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  onlyfans: string;

  @Column({ nullable: true })
  other_link: string;

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
  cleanPhone() {
    this.phone = this.phone.replace(/\D/g, '');
  }
}
