import { Expose, Exclude } from 'class-transformer';

export class UserResponseDto {
  @Exclude()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  verified: boolean;

  @Expose()
  vip: boolean;

  @Exclude()
  password: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
