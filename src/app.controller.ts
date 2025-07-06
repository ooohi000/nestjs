import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello/:id/:name')
  getHello(
    @Req() req: Request,
    @Body() body: any,
    @Param() param: any,
  ): string {
    console.log(req);
    return this.appService.getHello();
  }
}
