import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global/global.module';
import { UserModule } from './user/user.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { ApplicationModule } from './application/application.module';
import { ModelModule } from './model/model.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { MetricModule } from './metric/metric.module';
import { MailModule } from './mail/mail.module';
import { AwsModule } from './aws/aws.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    GlobalModule,
    AuthModule,
    AwsModule,
    MailModule,
    MetricModule,
    UserModule,
    InquiryModule,
    ApplicationModule,
    ModelModule,
    SponsorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
