import { Injectable } from '@nestjs/common';
import { Model } from './entity/model.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ModelFile } from './entity/model-file.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { FileService } from 'src/aws/s3/file.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    @InjectRepository(ModelFile)
    private modelFileRepository: Repository<ModelFile>,
    private readonly dataSource: DataSource,
    private fileService: FileService,
  ) {}

  async getModels(responseObject: any, query: any) {
    try {
      const { page, search } = query;
      // Get models paginated by 20 with query
      const models = await this.modelRepository.find({
        // Search multiple fields lowercase or if substring exists // Example if search = j then John Doe will be returned // first_name Or last_name
        where: [
          { first_name: Like(`%${search}%`) },
          { last_name: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
        ],
        take: 20,
        skip: page * 20 - 20,
      });
      // If no models found
      if (!models) {
        responseObject.message = 'No models found';
        responseObject.data = [];
        return responseObject;
      }
      // Attatch images to models if any exist
      const modelLength = models.length;
      for (let i = 0; i < modelLength; i++) {
        const model = models[i];
        //  mime: 'image%' to get only images
        const files = await this.modelFileRepository.find({
          where: {
            model_uuid: model.uuid,
            file_mime: Like('%image%'),
          },
        });
        model['files'] = files;
      }
      // If models found return models and pagination details
      responseObject.status = true;
      responseObject.message = 'Models found';
      responseObject.data['models'] = models;
      responseObject.data['pagination'] = {
        total: models.length,
        page: 1,
      };
      responseObject.data['query'] = query;
      return responseObject;
    } catch (error) {
      responseObject.message = 'Failed to get models';
      responseObject.data = [];
      return responseObject;
    }
  }

  async createModel(responseObject: any, createModelDto: any, files: any) {
    // Create a query runner to manage the transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate UUID
      const uuid = uuidv4();
      createModelDto.uuid = uuid;
      // Create and save the model entity within the transaction
      const modelObject = this.modelRepository.create(createModelDto);
      const modelApplication = await queryRunner.manager.save(modelObject);

      if (modelApplication) {
        // Upload files if any
        const uploadedFiles = [];

        if (files.length > 0) {
          const fileLength = files.length;
          // Upload files to S3
          for (let i = 0; i < fileLength; i++) {
            const filePath = 'public/model/' + uuid + '/files';
            const file = files[i];
            const fileUploadResponse = await this.fileService.uploadFile(
              file,
              filePath,
            );
            // Check status of file upload
            if (fileUploadResponse['status']) {
              fileUploadResponse['data']['model_uuid'] = uuid;
              uploadedFiles.push(fileUploadResponse['data']);
            }
            // If file discrepancy notify some files were not uploaded
            if (fileLength > 0 && uploadedFiles.length < fileLength) {
              responseObject.message =
                'Some files were not uploaded. Model created.';
            }
          }
          // Upload to db if files were uploaded
          if (uploadedFiles.length > 0) {
            const recordedFiles = await this.associateModelFiles(uploadedFiles);
            // Check if file recorded discrepancy occurred and notify
            if (
              uploadedFiles.length > 0 &&
              recordedFiles.length < uploadedFiles.length
            ) {
              responseObject.message =
                'Some files were not recorded. Model created.';
            }
          }

          // If no files were uploaded or recorded
          if (uploadedFiles.length == 0) {
            await queryRunner.rollbackTransaction();
            responseObject.message =
              'No files were uploaded. Model not created.';
            return responseObject;
          }
        }

        // Prepare response object
        responseObject['status'] = true;
        responseObject['statusCode'] = 201;
        responseObject['message'] = 'Model created successfully.';
        responseObject['data']['model'] = modelApplication;
        responseObject['data']['files'] = uploadedFiles;
        // Commit transaction if everything succeeded
        await queryRunner.commitTransaction();
      } else {
        // Rollback transaction if application creation failed
        await queryRunner.rollbackTransaction();
        responseObject.message = 'Model creation failed.';
        return responseObject;
      }
    } catch (error) {
      // Rollback transaction if an error occurs
      await queryRunner.rollbackTransaction();
      responseObject.message = 'Model creation failed. Internal error.';
      responseObject.errors.push(error.message);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }

    return responseObject;
  }

  // Associate file with the model in db
  private async associateModelFiles(files) {
    const results = [];
    try {
      const fileLength = files.length;
      for (let i = 0; i < fileLength; i++) {
        const file = files[i];
        const fileRecord = this.modelFileRepository.create(file);
        const resultFile = await this.modelFileRepository.save(fileRecord);
        results.push(resultFile);
      }
    } catch (error) {}

    return results;
  }
}
