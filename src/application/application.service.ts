import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { ModelApplication } from './entity/model-application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ModelApplication)
    private modelApplicationRepository: Repository<ModelApplication>,
    private readonly dataSource: DataSource,
    private mailService: MailService,
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
      createModelApplicationDto.uuid = uuidv4();
      // Create and save the application entity within the transaction
      let modelApplication = this.modelApplicationRepository.create(
        createModelApplicationDto,
      );
      modelApplication = await queryRunner.manager.save(modelApplication);

      if (modelApplication) {
        // Prepare email object
        const emailObject = {
          from: 'support@ezvsx.com',
          to: createModelApplicationDto.email,
          subject: 'Please confirm your email',
          text:
            'https://luxiqx.com/confirm-email/' +
            createModelApplicationDto.uuid,
        };

        // Send the email
        const sendEmailResponse = await this.mailService.sendEmail(
          emailObject,
          'verification',
        );

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
            'Email verification failed. Application not created.';
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
}
