import { Controller, Post } from '@nestjs/common';

@Controller('payment')
export class PaymentController {
  @Post('razorpay')
  payment() {
    return 'successful';
  }
}
