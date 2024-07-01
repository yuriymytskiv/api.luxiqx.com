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
  // Get shopify details based on the env
  async getShopifyEnvironmentDetails() {
    const details = {
      baseUrl: null,
      apiAccessToken: null,
    };

    if (this.shopifyEnvironment == 'sandbox') {
      details.baseUrl = process.env.SHOPIFY_SANDBOX_API_URL ?? null;
      details.apiAccessToken = process.env.SHOPIFY_SANDBOX_ACCESS_TOKEN ?? null;
    }

    if (this.shopifyEnvironment == 'prod') {
      details.baseUrl = process.env.SHOPIFY_PRODUCTION_API_URL ?? null;
      details.apiAccessToken =
        process.env.SHOPIFY_PRODUCTION_ACCESS_TOKEN ?? null;
    }

    return details;
  }
}
