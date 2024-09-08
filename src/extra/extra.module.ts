import { Module } from '@nestjs/common';
import { ExtraService } from './extra.service';
import { ExtraController } from './extra.controller';
import { AwsModule } from 'src/aws/aws.module';
import { GlobalModule } from 'src/global/global.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poster } from './entity/posters.entity';

@Module({
  imports: [GlobalModule, AwsModule, TypeOrmModule.forFeature([Poster])],
  providers: [ExtraService],
  controllers: [ExtraController],
})
export class ExtraModule {}
