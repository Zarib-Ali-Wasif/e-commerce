import { Injectable, InternalServerErrorException } from '@nestjs/common';
require('dotenv').config();
const nodemailer = require('nodemailer');

@Injectable()
export class MailerService {
  async sendEmail(
    recepient: string,
    subject: string,
    email_body: string,
  ): Promise<any> {
    const transporter = this.getTransporter();
    const mailOptions = this.getMailOptions(recepient, subject, email_body);

    await new Promise<void>((resolve, reject) => {
      transporter.sendMail(mailOptions, (error: { message: any }) => {
        if (error) {
          console.log('Error in sending mail(mailer service)', error.message);
          reject(
            new InternalServerErrorException(
              'Failed to send verification email.',
              error.message,
            ),
          );
        } else {
          console.log('Email Sent');
          resolve();
        }
      });
    });
  }

  getTransporter() {
    return nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_ECHELON_PASS,
      },
    });
  }

  getMailOptions(recepient: string, subject: string, email_body: string) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: recepient,
      subject: subject,
      html: email_body,
    };

    return mailOptions;
  }
}

//   getTransporter() {
//     return nodemailer.createTransport({
//       host: 'smtp-mail.outlook.com',
//       secureConnection: false,
//       port: 587,
//       service: 'outlook',
//       auth: {
//         user: 'zaribaliwasif140@outlook.com',
//         pass: 'wrskiqeqwdtevvzi',
//       },
//       tls: {
//         ciphers: 'SSLv3',
//       },
//     });
//   }

//   getMailOptions(recepient: string, subject: string, email_body: string) {
//     const mailOptions = {
//       from: 'zaribaliwasif140@outlook.com',
//       to: recepient,
//       subject: subject,
//       html: email_body,
//     };

//     return mailOptions;
//   }
// }
