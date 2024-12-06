import { OrderDto } from './../dto/order.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { PrismaService } from 'src/prisma/prismaService';

@Injectable()
export class PaymentService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  // razorpay = new Razorpay({
  //   key_id: this.config.get('RAZPORPAY_KEY_ID'),
  //   key_secret: this.config.get('RAZPORPAY_KEY_ID'),
  // });
  //createing an order
  async createOrder(userId: string, orderDto: OrderDto) {
    try {
      const options = {
        amount: orderDto.amount,
        currency: orderDto.currency,
        receipt: 'first_Order',
      };
      //const or = this.razorpay.orders.create(options);
      // console.log(or);
      //const orderRes = await this.prisma.$transaction(
      //     async (tx) => {
      //       const order = await tx.orders.create({
      //         data: {
      //           ...or,
      //           userId: userId,
      //           success: true,
      //         },
      //       });
      //       const updatedUser = await tx.user.update({
      //         where: { id: userId },
      //         data: order,
      //       });
      //       return {
      //         ...order,
      //         updatedUser,
      //       };
      //     },
      //   );
      //   return orderRes;
    } catch (error) {
      throw error;
    }
  }
}
