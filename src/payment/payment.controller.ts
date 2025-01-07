import { OrderDto } from 'src/dto/order.dto';
import { PaymentService } from './payment.service';
import {
  Body,
  Controller,
  Post,
  Get,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Post('checkout')
  createOrder(@Body() orderDto: OrderDto) {
    return this.paymentService.createOrder(orderDto);
  }

  @Post('success')
  paymentSuccess(@Req() req: Request) {
    return this.paymentService.verifyOrder(req.body);
  }

  @Get('')
  getKey() {
    return this.paymentService.getKey();
  }
}
