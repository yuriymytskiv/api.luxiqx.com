import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateModelDto } from './dto/create-model.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GlobalService } from 'src/global/global.service';
import { ModelService } from './model.service';

@Controller('model')
export class ModelController {
  constructor(
    private globalService: GlobalService,
    private modelService: ModelService,
  ) {}

  // Get models
  @Get('/')
  async getModels(@Req() request: Request, @Query() query) {
    // Create response object
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );
    // Get all models
    return await this.modelService.getModels(responseObject, query);
  }

  // Create a new model
  @Post('/')
  @UseInterceptors(FilesInterceptor('files', 10))
  async createModelApplication(
    @Req() request: Request,
    @Body() createModelDto: CreateModelDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Create response object
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );
    // Check if files exist and if more then 10 files are uploaded
    if (files && files.length > 10) {
      responseObject.message = 'You can only upload 10 images';
      return responseObject;
    }
    // Create a new application
    return await this.modelService.createModel(
      responseObject,
      createModelDto,
      files,
    );
  }
}
