import {
  OrderDto,
  PaymentVerificationDto,
} from 'src/dto/order.dto';
import { PaymentService } from './payment.service';
import {
  Body,
  Controller,
  Post,
  Get,
} from '@nestjs/common';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}
  @Post('checkout')
  createOrder(
    // @Param('id') id: string,
    @Body() orderDto: OrderDto,
  ) {
    return this.paymentService.createOrder(orderDto);
  }
  @Post('success')
  paymentSuccess(
    @Body() paymentVerificationDto: PaymentVerificationDto,
  ) {
    return this.paymentService.verifyOrder(
      paymentVerificationDto,
    );
  }

  @Get('')
  getKey() {
    return this.paymentService.getKey();
  }
}
