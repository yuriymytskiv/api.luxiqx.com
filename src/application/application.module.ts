import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ModelApplication } from './entity/model-application.entity';
import { SponsorApplication } from './entity/sponsor-application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationFile } from './entity/application-file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModelApplication,
      SponsorApplication,
      ApplicationFile,
    ]),
  ],
  providers: [ApplicationService],
})
export class ApplicationModule {}
