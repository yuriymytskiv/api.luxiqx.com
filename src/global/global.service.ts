import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class GlobalService {
  constructor() {}

  // App Environment
  private environment = process.env.APP_ENV;
  private shopifyEnvironment = process.env.SHOPIFY_ENV;

  // Build response object
  createResponseObject(request: Request, status: boolean, statusCode: number) {
    return {
      status: status,
      statusCode: statusCode,
      path: request.url,
      message: null,
      errors: [],
      data: {},
    };
  }
}
