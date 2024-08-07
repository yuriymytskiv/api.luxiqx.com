import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private client: S3;
  private bucketName;

  constructor() {
    this.client = new S3();
    this.bucketName = process.env.AWS_S3_BUCKET;
  }

  // Upload file to S3
  async uploadFile(file, folderPath) {
    const result = {};

    try {
      const uniqueId = uuidv4();
      const fileExtension = file.originalname.split('.').pop();
      const key = `${folderPath}/${uniqueId}${fileExtension ? '.' + fileExtension : ''}`;
      const mimeType = await file.mimetype;
      const fileBuffer = await file.buffer;
      const fileSize = fileBuffer.byteLength / 1024;

      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
      };
      const response = await this.client.upload(params).promise();

      // Check if successful
      if (response['Location'] && response['ETag']) {
        result['status'] = true;
        result['data'] = {
          file_url: response['Location'],
          file_path: key,
          file_mime: mimeType,
          file_size: fileSize,
        };
      } else {
        result['status'] = false;
        result['error'] = 'File upload failed';
      }
    } catch (error) {
      result['status'] = false;
      result['error'] = error.message;
    }

    return result;
  }

  // Get file from S3
  async getFile(folderPath, fileName) {
    const params = {
      Bucket: this.bucketName,
      Key: `${folderPath}/${fileName}`,
    };

    return this.client.getObject(params).createReadStream();
  }

  // Delete file from S3
  async deleteFile(folderPath, fileName) {
    const params = {
      Bucket: this.bucketName,
      Key: `${folderPath}/${fileName}`,
    };

    return this.client.deleteObject(params).promise();
  }

  // Get all files in a directory
  async listFiles(folderPath) {
    const params = {
      Bucket: this.bucketName,
      Prefix: folderPath,
    };

    return this.client.listObjectsV2(params).promise();
  }

  // Delete all files in a directory
  async deleteFiles(folderPath) {
    const files = await this.listFiles(folderPath);

    if (files.Contents.length === 0) {
      return;
    }

    const deleteParams = {
      Bucket: this.bucketName,
      Delete: {
        Objects: files.Contents.map((file) => ({ Key: file.Key })),
      },
    };

    return this.client.deleteObjects(deleteParams).promise();
  }
}
