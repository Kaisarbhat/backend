import { OrderDto } from 'src/dto/order.dto';
import { PaymentService } from './payment.service';
import {
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';

@Controller('order')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}
  @Post(':id')
  createOrder(
    @Param('id') id: string,
    @Body() orderDto: OrderDto,
  ) {
    return this.paymentService.createOrder(id, orderDto);
  }
}
