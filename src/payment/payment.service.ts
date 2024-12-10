import { Payment } from './../../node_modules/.prisma/client/index.d';
import { RazorpayConfig } from './razorpay.config';
import {
  OrderDto,
  PaymentVerificationDto,
} from './../dto/order.dto';
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaService';
import { OrderStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly razorpayConfig: RazorpayConfig,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}
  //creating an order
  async createOrder(orderDto: OrderDto) {
    try {
      const { amount, currency } = orderDto;

      // Create order
      const options = {
        amount: amount * 100,
        currency: currency || 'INR',
        receipt: 'receipt_' + Date.now(),
        payment_capture: 1,
      };

      const order = await this.razorpayConfig
        .getInstance()
        .orders.create(options);

      return {
        id: order.id,
        currency: order.currency,
        amount: order.amount,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        message: 'Error creating order',
        error: error.message,
      };
    }
  }

  async getKey() {
    return this.config.get('RAZORPAY_KEY_ID');
  }
  async verifyOrder(
    paymentVerificationDto: PaymentVerificationDto,
  ) {
    try {
      const secret = this.config.get('RAZORPAY_KEY_SECRET');
      const signature = crypto
        .createHmac('sha256', secret)
        .update(
          paymentVerificationDto.orderCreationId +
            '|' +
            paymentVerificationDto.razorpayPaymentId,
        )
        .digest('hex');
      if (
        signature !==
        paymentVerificationDto.razorpaySignature
      ) {
        throw new BadRequestException(
          'Invalid Payment Signature',
        );
      }
      //optionally verifying with razorpay
      const payment = await this.razorpayConfig
        .getInstance()
        .payments.fetch(
          paymentVerificationDto.razorpayPaymentId,
        );

      if (payment.status !== 'captured') {
        throw new BadRequestException(
          'Payment not captured',
        );
      }
      console.log('Payment :', payment);
      // await this.prisma.payment.create({
      //   data : {...payment,}
      // })
      return {
        msg: 'Payment verified successfully',
        orderId: paymentVerificationDto.razorpayOrderId,
        paymentId: paymentVerificationDto.razorpayPaymentId,
        status: payment.status,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Payment verification failed: ' + error.message,
      );
    }
  }
}
