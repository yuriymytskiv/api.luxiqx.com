import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ModelApplication } from './entity/model-application.entity';
import { SponsorApplication } from './entity/sponsor-application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationFile } from './entity/application-file.entity';
import { ApplicationController } from './application.controller';
import { GlobalModule } from 'src/global/global.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    GlobalModule,
    MailModule,
    TypeOrmModule.forFeature([
      ModelApplication,
      SponsorApplication,
      ApplicationFile,
    ]),
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
