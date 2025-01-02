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
import { UsersService } from 'src/users/users.service';
import { EventRegistrationDto } from 'src/dto/event.registration.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly razorpayConfig: RazorpayConfig,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
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
    registrationData: EventRegistrationDto;
    eventId: string;
  }) {
    try {
      // Verify payment signature first (outside transaction)
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

      // Verify payment with Razorpay
      const payment = await this.razorpayConfig
        .getInstance()
        .payments.fetch(dto.razorpayPaymentId);

      if (payment.status !== 'captured') {
        throw new BadRequestException(
          'Payment not captured',
        );
      }

      // Process payment and create records in transaction with increased timeout
      return await this.prisma.$transaction(
        async (tx) => {
          // Create payment record
          const paymentData =
            await this.processPaymentResponse(payment);
          const createdPayment = await tx.payment.create({
            data: paymentData,
          });

          // Create registration record with payment reference
          const registration =
            await this.usersService.registerForEvent(
              dto.registrationData,
              dto.eventId,
              createdPayment.id,
              tx, // Pass transaction client
            );

          return {
            msg: 'Payment verified and registration completed successfully',
            orderId: dto.razorpayOrderId,
            paymentId: dto.razorpayPaymentId,
            registrationId: registration.registration.id,
            status: payment.status,
          };
        },
        {
          timeout: 10000, // Increased timeout to 10 seconds
          maxWait: 20000,
        },
      );
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
    const paymentMethod = this.mapPaymentMethod(
      razorpayResponse.method,
    );

    return {
      razorpayPaymentId: razorpayResponse.id,
      amount: amountInRupees,
      currency: razorpayResponse.currency,
      status: razorpayResponse.status,
      method: paymentMethod,
      email: razorpayResponse.email,
      contact: razorpayResponse.contact,
      paymentDetails: {
        wallet: razorpayResponse.wallet || null,
        bank: razorpayResponse.bank || null,
        vpa: razorpayResponse.vpa || null,
      },
      errorCode: razorpayResponse.error_code,
      errorDescription: razorpayResponse.error_description,
      orderId: razorpayResponse.order_id,
    };
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
