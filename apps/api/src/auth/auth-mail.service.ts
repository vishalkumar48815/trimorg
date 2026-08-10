import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

interface AuthMailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class AuthMailService {
  private readonly logger = new Logger(AuthMailService.name);
  private transporter: Transporter | null;

  constructor(private readonly configService: ConfigService) {
    const smtpUrl = this.configService.get<string>('SMTP_URL');
    this.transporter = smtpUrl ? nodemailer.createTransport(smtpUrl) : null;
  }

  async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
    if (!this.transporter) {
      this.logDevEmail(
        [
          '=================================',
          'EMAIL VERIFICATION (SMTP not configured)',
          `Email: ${email}`,
          `OTP: ${verificationCode}`,
          'Expires: 10 minutes',
          '=================================',
        ].join('\n'),
      );
      return;
    }

    await this.send({
      to: email,
      subject: 'Verify your Trimorg email',
      text: [
        'Welcome to Trimorg.',
        '',
        `Your verification code is: ${verificationCode}`,
        '',
        'This code expires in 10 minutes.',
      ].join('\n'),
      html: [
        '<p>Welcome to Trimorg.</p>',
        `<p>Your verification code is <strong>${verificationCode}</strong>.</p>`,
        '<p>This code expires in 10 minutes.</p>',
      ].join('\n'),
    });
  }

  async sendPasswordResetEmail(email: string, link: string): Promise<void> {
    if (!this.transporter) {
      this.logDevEmail(
        [
          '=================================',
          'PASSWORD RESET (SMTP not configured)',
          `Email: ${email}`,
          `Link: ${link}`,
          '=================================',
        ].join('\n'),
      );
      return;
    }

    await this.send({
      to: email,
      subject: 'Reset your Trimorg password',
      text: `Reset your Trimorg password: ${link}`,
      html: `<p>Reset your Trimorg password by opening <a href="${link}">${link}</a>.</p>`,
    });
  }

  private logDevEmail(message: string): void {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP_URL is required in production.');
    }

    this.logger.log(message);
  }

  private async send(options: AuthMailOptions): Promise<void> {
    const from = this.configService.get<string>('SMTP_FROM') ?? 'Trimorg <no-reply@trimorg.local>';
    await this.transporter!.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
