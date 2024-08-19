import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { GlobalModule } from 'src/global/global.module';
import { AwsModule } from 'src/aws/aws.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entity/model.entity';
import { ModelFile } from './entity/model-file.entity';
import { ModelController } from './model.controller';

@Module({
  imports: [
    GlobalModule,
    AwsModule,
    TypeOrmModule.forFeature([Model, ModelFile]),
  ],
  providers: [ModelService],
  controllers: [ModelController],
})
export class ModelModule {}
