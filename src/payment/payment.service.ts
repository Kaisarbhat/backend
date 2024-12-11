import { Payment } from './../../node_modules/.prisma/client/index.d';
import { RazorpayConfig } from './razorpay.config';
import { OrderDto } from './../dto/order.dto';
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaService';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PaymentMethod } from '@prisma/client';

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

  async verifyOrder(dto: {
    orderCreationId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    try {
      const secret = this.config.get('RAZORPAY_KEY_SECRET');
      const hmac = crypto.createHmac('sha256', secret);
      const data = `${dto.razorpayOrderId}|${dto.razorpayPaymentId}`;
      hmac.update(data);
      const generatedSignature = hmac.digest('hex');
      if (generatedSignature !== dto.razorpaySignature) {
        throw new BadRequestException(
          'Invalid Payment Signature',
        );
      }
      //optionally verifying with razorpay
      const payment = await this.razorpayConfig
        .getInstance()
        .payments.fetch(dto.razorpayPaymentId);

      if (payment.status !== 'captured') {
        throw new BadRequestException(
          'Payment not captured',
        );
      }
      const paymentData =
        await this.processPaymentResponse(payment);
      const savedPayment = await this.prisma.payment.create(
        {
          data: paymentData,
        },
      );

      console.log('Saved Payment :', savedPayment);
      return {
        msg: 'Payment verified successfully',
        orderId: dto.razorpayOrderId,
        paymentId: dto.razorpayPaymentId,
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
  private async processPaymentResponse(razorpayResponse) {
    const amountInRupees = razorpayResponse.amount / 100;

    // Map payment method from Razorpay to your enum
    const paymentMethod = this.mapPaymentMethod(
      razorpayResponse.method,
    );

    // Create payment details object
    const paymentDetails = {
      wallet: razorpayResponse.wallet || null,
      bank: razorpayResponse.bank || null,
      vpa: razorpayResponse.vpa || null,
    };

    // Create payment record
    const payment = {
      razorpayPaymentId: razorpayResponse.id,
      amount: amountInRupees,
      currency: razorpayResponse.currency,
      status: razorpayResponse.status,
      method: paymentMethod,
      email: razorpayResponse.email,
      contact: razorpayResponse.contact,
      paymentDetails: paymentDetails,
      errorCode: razorpayResponse.error_code,
      errorDescription: razorpayResponse.error_description,
      orderId: razorpayResponse.order_id,
    };

    return payment;
  }
  private mapPaymentMethod(
    razorpayMethod: string,
  ): PaymentMethod {
    switch (razorpayMethod.toLowerCase()) {
      case 'card':
        return 'CARD';
      case 'netbanking':
        return 'NET_BANKING';
      case 'wallet':
        return 'WALLET';
      case 'upi':
        return 'UPI';
      default:
        throw new Error(
          `Unsupported payment method: ${razorpayMethod}`,
        );
    }
  }
}
