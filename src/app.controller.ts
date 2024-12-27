import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor() {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Get()
  health(): any {
    return 'OK';
  }
}
