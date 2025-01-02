import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RazorpayConfig } from './razorpay.config';
import { EmailService } from 'src/users/email.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, RazorpayConfig, EmailService],
  imports: [UsersModule],
})
export class PaymentModule {}
