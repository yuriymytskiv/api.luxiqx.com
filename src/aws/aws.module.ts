import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import * as AWS from 'aws-sdk';
import { FileService } from './s3/file.service';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
@Module({
  imports: [],
  providers: [AwsService, FileService],
  exports: [AwsService, FileService],
})
export class AwsModule {}
