import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { GlobalService } from 'src/global/global.service';
import { ApplicationService } from './application.service';
import { CreateModelApplicationDto } from './dto/create-model-application.dto';
import { CreateSponsorApplicationDto } from './dto/create-sponsor-application.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MailService } from 'src/mail/mail.service';

@Controller('application')
export class ApplicationController {
  constructor(
    private globalService: GlobalService,
    private applicationService: ApplicationService,
    private mailService: MailService,
  ) {}

  // Create a new application
  @Post('model')
  @UseInterceptors(FilesInterceptor('files', 10))
  async createModelApplication(
    @Req() request: Request,
    @Body() createModelApplicationDto: CreateModelApplicationDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Create response object
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );
    // Check if email is real
    // const realEmail = await this.mailService.validateEmail(
    //   createModelApplicationDto.email,
    // );
    // return realEmail;
    // Check if files exist and if more then 10 files are uploaded
    if (files && files.length > 10) {
      responseObject.message = 'You can only upload 10 images';
      return responseObject;
    }
    // Create a new application
    return await this.applicationService.createModelApplication(
      responseObject,
      createModelApplicationDto,
      files,
    );
  }

  // Create a new application
  @Post('sponsor')
  async createSponsorApplication(
    @Req() request: Request,
    @Body() createSponsorApplicationDto: CreateSponsorApplicationDto,
  ) {
    // Create response object
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );
    // Check if email is real
    // const realEmail = await this.mailService.validateEmail(
    //   createModelApplicationDto.email,
    // );
    // return realEmail;
    // Create a new application
    return await this.applicationService.createSponsorApplication(
      responseObject,
      createSponsorApplicationDto,
    );
  }
}
