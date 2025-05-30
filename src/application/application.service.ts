import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { FileService } from 'src/aws/s3/file.service';
import { ModelApplication } from './entity/model-application.entity';
import { SponsorApplication } from './entity/sponsor-application.entity';
import { ApplicationFile } from './entity/application-file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ModelApplication)
    private modelApplicationRepository: Repository<ModelApplication>,
    @InjectRepository(SponsorApplication)
    private sponsorApplicationRepository: Repository<SponsorApplication>,
    @InjectRepository(ApplicationFile)
    private applicationFileRepository: Repository<ApplicationFile>,
    private readonly dataSource: DataSource,
    private mailService: MailService,
    private fileService: FileService,
  ) {}

  async createModelApplication(
    responseObject: any,
    createModelApplicationDto: any,
    files: any,
  ) {
    // Create a query runner to manage the transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate UUID
      const uuid = uuidv4();
      createModelApplicationDto.uuid = uuid;
      // Create and save the application entity within the transaction
      const modelApplicationObject = this.modelApplicationRepository.create(
        createModelApplicationDto,
      );
      const modelApplication = await queryRunner.manager.save(
        modelApplicationObject,
      );

      if (modelApplication) {
        // Upload files if any
        const uploadedFiles = [];

        if (files.length > 0) {
          const fileLength = files.length;
          // Upload files to S3
          for (let i = 0; i < fileLength; i++) {
            const filePath = 'private/application/' + uuid + '/model/files';
            const file = files[i];
            const fileUploadResponse = await this.fileService.uploadFile(
              file,
              filePath,
            );
            // Check status of file upload
            if (fileUploadResponse['status']) {
              fileUploadResponse['data']['application_uuid'] = uuid;
              uploadedFiles.push(fileUploadResponse['data']);
            }
            // If file discrepancy notify some files were not uploaded
            if (fileLength > 0 && uploadedFiles.length < fileLength) {
              responseObject.message =
                'Some files were not uploaded. Application created.';
            }
          }
          // Upload to db if files were uploaded
          if (uploadedFiles.length > 0) {
            const recordedFiles =
              await this.associateApplicationFiles(uploadedFiles);
            // Check if file recorded discrepancy occurred and notify
            if (
              uploadedFiles.length > 0 &&
              recordedFiles.length < uploadedFiles.length
            ) {
              responseObject.message =
                'Some files were not recorded. Application created.';
            }
          }

          // If no files were uploaded or recorded
          if (uploadedFiles.length == 0) {
            await queryRunner.rollbackTransaction();
            responseObject.message =
              'No files were uploaded. Application not created.';
            return responseObject;
          }
        }

        // Prepare email object
        const emailObject = {
          to: [createModelApplicationDto.email],
          subject: 'Please confirm your email',
          text:
            'https://api.luxiqx.com/application/confirm/' +
            createModelApplicationDto.uuid,
          type: 'verification',
        };

        // Send the email
        const sendEmailResponse = await this.mailService.sendMail(emailObject);

        if (!sendEmailResponse.emailSent) {
          // Rollback transaction if email sending failed
          await queryRunner.rollbackTransaction();
          responseObject.message =
            'Emailing verification failed. Application not created.';
          return responseObject;
        }

        // Prepare response object
        responseObject['status'] = true;
        responseObject['statusCode'] = 201;
        responseObject['message'] = 'Application created successfully.';
        responseObject['data']['model'] = modelApplication;
        responseObject['data']['files'] = uploadedFiles;
        // Commit transaction if everything succeeded
        await queryRunner.commitTransaction();
      } else {
        // Rollback transaction if application creation failed
        await queryRunner.rollbackTransaction();
        responseObject.message = 'Application creation failed.';
        return responseObject;
      }
    } catch (error) {
      // Rollback transaction if an error occurs
      await queryRunner.rollbackTransaction();
      responseObject.message = 'Application creation failed. Internal error.';
      responseObject.errors.push(error.message);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }

    return responseObject;
  }

  async createSponsorApplication(
    responseObject: any,
    createSponsorApplicationDto: any,
  ) {
    // Create a query runner to manage the transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate UUID
      createSponsorApplicationDto.uuid = uuidv4();
      // Create and save the application entity within the transaction
      let sponsorApplication = this.sponsorApplicationRepository.create(
        createSponsorApplicationDto,
      );
      sponsorApplication = await queryRunner.manager.save(sponsorApplication);

      if (sponsorApplication) {
        // Prepare email object
        const emailObject = {
          from: 'support@ezvsx.com',
          to: createSponsorApplicationDto.contact_email,
          subject: 'Please confirm your email',
          text:
            'https://api.luxiqx.com/application/confirm/' +
            createSponsorApplicationDto.uuid,
          type: 'verification',
        };

        // Send the email
        const sendEmailResponse = await this.mailService.sendMail(emailObject);

        // Check if the email was sent successfully
        if (sendEmailResponse.emailSent) {
          // Commit transaction if everything succeeded
          await queryRunner.commitTransaction();
          responseObject.message = 'Application created successfully.';
          responseObject.status = true;
          responseObject.statusCode = 200;
        } else {
          // Rollback transaction if email sending failed
          await queryRunner.rollbackTransaction();
          responseObject.message =
            'Emailing verification failed. Application not created.';
        }
      } else {
        // Rollback transaction if application creation failed
        await queryRunner.rollbackTransaction();
        responseObject.message = 'Application creation failed.';
      }
    } catch (error) {
      // Rollback transaction if an error occurs
      await queryRunner.rollbackTransaction();
      responseObject.message = 'Application creation failed. Internal error.';
      responseObject.errors.push(error.message);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }

    return responseObject;
  }

  // Remove application
  async removeApplication(responseObject, uuid: string) {
    // 3 Step process.
    // 1. Check if model application exist with in model applications or sponsor applications
    // 2. Get the application files.
    // 3. Delete the application and the files
    let targetApplication = null;
    // Check if model application exist with the uuid
    const modelApplication = await this.modelApplicationRepository.findOne({
      where: { uuid: uuid },
    });
    // If model application exist
    if (modelApplication) {
      targetApplication = modelApplication;
    }
    // Check if sponsor application exist with the uuid
    const sponsorApplication = await this.sponsorApplicationRepository.findOne({
      where: { uuid: uuid },
    });
    // If sponsor application exist
    if (sponsorApplication) {
      targetApplication = sponsorApplication;
    }
    // If no application found
    if (!targetApplication) {
      responseObject.message = 'No application found.';
      return responseObject;
    }
    // Get the application files
    const applicationFiles = await this.applicationFileRepository.find({
      where: { application_uuid: uuid },
    });

    const applicationFilesS3DirectoryPath = 'private/application/' + uuid;

    // Create a query runner to manage the transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete the application and the files
      await queryRunner.manager.remove(targetApplication);
      await queryRunner.manager.remove(applicationFiles);
      await this.fileService.deleteFiles(applicationFilesS3DirectoryPath);
      // Commit transaction if everything succeeded
      await queryRunner.commitTransaction();
      responseObject.message = 'Application deleted successfully.';
      responseObject.status = true;
      responseObject.statusCode = 200;
    } catch (error) {
      // Rollback transaction if an error occurs
      await queryRunner.rollbackTransaction();
      responseObject.message = 'Application deletion failed. Internal error.';
      responseObject.errors.push(error.message);
    } finally {
      // Release the query runner
      await queryRunner.release();
    }

    return responseObject;
  }

  // Confirm application
  async confirmApplication(uuid: string) {
    function notifyAdmin($uuid) {
      const emailObjectNotify = {
        from: 'support@ezvsx.com',
        to: ['yuriy.myt@ezvsx.com'],
        subject: 'New Inquiry',
        text:
          'Application received. Please check the admin panel. Application ID: ' +
          uuid,
        type: 'notification',
      };
      // Send the email
      this.mailService.sendMail(emailObjectNotify);
    }
    // Check if model application exist with the uuid
    const modelApplication = await this.modelApplicationRepository.findOne({
      where: { uuid: uuid },
    });
    // If model application exist
    if (modelApplication) {
      // Update the application status
      modelApplication.email_verified = 1;
      await this.modelApplicationRepository.save(modelApplication);
      // Notify admin about the new application
      notifyAdmin(uuid);
      // Responding with html
      return `<a class='text-decoration: none;' href="https://luxiqx.com/">Application confirmed. Click here to continue.</a>`;
    }
    // Check if sponsor application exist with the uuid
    const sponsorApplication = await this.sponsorApplicationRepository.findOne({
      where: { uuid: uuid },
    });
    // If sponsor application exist
    if (sponsorApplication) {
      // Update the application status
      sponsorApplication.contact_email_verified = 1;
      await this.sponsorApplicationRepository.save(sponsorApplication);
      // Notify admin about the new application
      notifyAdmin(uuid);
      // Responding with html
      return `<a class='text-decoration: none;' href="https://luxiqx.com/">Application confirmed. Click here to continue.</a>`;
    }
    // No application found
    return `<a class='text-decoration: none;' href="https://luxiqx.com/">Invalid confirmation link. Click here to continue.</a>`;
  }

  // Associate application file with the application in db
  private async associateApplicationFiles(files) {
    const results = [];
    try {
      const fileLength = files.length;
      for (let i = 0; i < fileLength; i++) {
        const file = files[i];
        const fileRecord = this.applicationFileRepository.create(file);
        const resultFile =
          await this.applicationFileRepository.save(fileRecord);
        results.push(resultFile);
      }
    } catch (error) {}

    return results;
  }
}
