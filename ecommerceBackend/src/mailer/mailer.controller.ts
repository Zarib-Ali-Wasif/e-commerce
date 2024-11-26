import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer') // Base route for this controller
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendEmail(
    @Body() body: { recepient: string; subject: string; email_body: string },
  ) {
    const { recepient, subject, email_body } = body;

    if (!recepient || !subject || !email_body) {
      throw new HttpException(
        'Invalid input: recepient, subject, and email_body are required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.mailerService.sendEmail(recepient, subject, email_body);
      return { message: 'Email sent successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
