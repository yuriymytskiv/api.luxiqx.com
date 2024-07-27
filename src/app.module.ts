import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { GlobalModule } from './global/global.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApplicationModule } from './application/application.module';
import { ModelModule } from './model/model.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { MetricModule } from './metric/metric.module';

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
    GlobalModule,
    AuthModule,
    UserModule,
    ApplicationModule,
    ModelModule,
    SponsorModule,
    MetricModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
