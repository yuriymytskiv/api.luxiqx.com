import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { GlobalService } from 'src/global/global.service';
import { SendMailDto } from './dto/send-mail.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
@Controller('mail')
export class MailController {
  constructor(
    private globalService: GlobalService,
    private mailService: MailService,
  ) {}

  @Post('/send')
  @UseGuards(AuthGuard('jwt'))
  async sendMail(@Req() request: Request, @Body() sendMailDto: SendMailDto) {
    // Creating response object
    const responseObject = this.globalService.createResponseObject(
      request,
      false,
      500,
    );

    // Make sure their are recipients to send emails too
    if (sendMailDto.to.length == 0) {
      responseObject.message = 'No recipients to send email too.';
      return responseObject;
    }
    const emailObject = {
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      text: sendMailDto.text,
      html: sendMailDto.html,
    };
    // Send the emails
    const response = await this.mailService.sendMail(emailObject);
    // Check if the email was sent
    if (response) {
      responseObject.message = 'Email sent successfully.';
      responseObject.status = true;
      responseObject.statusCode = 200;
      responseObject.data = response;
    } else {
      responseObject.message = 'Email failed to send.';
      responseObject.data = response;
    }
    // Return the response object
    return responseObject;
  }
}
