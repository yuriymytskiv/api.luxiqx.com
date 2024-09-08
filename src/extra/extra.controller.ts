import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GlobalService } from 'src/global/global.service';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtraService } from './extra.service';

@Controller('extra')
export class ExtraController {
  constructor(
    private globalService: GlobalService,
    private extraService: ExtraService,
  ) {}

  @Get('/posters/')
  async getAllPosters(@Req() request: Request) {
    // Create response object
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );
    // Get all posters
    return await this.extraService.getAllPosters(responseObject);
  }

  @Post('/posters/')
  @UseInterceptors(FileInterceptor('file'))
  async createPoster(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Create response object
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );
    // Check if file is not uploaded
    if (!file) {
      responseObject['message'] = 'No file uploaded';
      return responseObject;
    }
    // Return file name
    return await this.extraService.createPoster(responseObject, file);
  }
}
