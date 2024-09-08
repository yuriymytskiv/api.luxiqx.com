import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/aws/s3/file.service';
import { Repository } from 'typeorm';
import { Poster } from './entity/posters.entity';

@Injectable()
export class ExtraService {
  constructor(
    private fileService: FileService,
    @InjectRepository(Poster)
    private posterRepository: Repository<Poster>,
  ) {}

  async getAllPosters(responseObject: any) {
    try {
      // Get all posters
      const posters = await this.posterRepository.find();
      // If no posters found
      if (!posters) {
        responseObject['message'] = 'No posters found';
        responseObject['data'] = [];
        return responseObject;
      }
      // If posters found
      responseObject['status'] = true;
      responseObject['message'] = 'Posters found';
      responseObject['data'] = posters;
      return responseObject;
    } catch (error) {
      responseObject['message'] = 'Failed to get posters';
      responseObject['data'] = [];
      return responseObject;
    }
  }

  async createPoster(responseObject: any, file: Express.Multer.File) {
    try {
      // Path to upload file // With file extension
      const filePath = 'public/posters';
      // Upload file to S3
      const uploadFile = await this.fileService.uploadFile(file, filePath);
      // Create poster record in database
      if (uploadFile['status'] !== true) {
        responseObject['message'] = 'Failed to upload file';
        return responseObject;
      }
      // Create a poster record in database
      const posterObject = this.posterRepository.create(uploadFile['data']);
      // Save poster record
      const posterRecord = await this.posterRepository.save(posterObject);

      // If poster record is not saved
      if (!posterRecord) {
        responseObject['status'] = true;
        responseObject['message'] =
          'File was uploaded but failed to save record.';
        return responseObject;
      }
      // If poster record is saved
      responseObject['status'] = true;
      responseObject['message'] = 'Poster uploaded and record saved.';
      responseObject['data'] = posterRecord;
      return responseObject;
    } catch (error) {
      responseObject['message'] = 'Failed to upload file';
      return responseObject;
    }
  }
}
