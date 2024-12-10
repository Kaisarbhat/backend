import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RazorpayConfig } from './razorpay.config';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, RazorpayConfig],
})
export class PaymentModule {}
