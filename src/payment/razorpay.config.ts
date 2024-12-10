import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayConfig {
  private readonly razorpay: Razorpay;
  constructor(config: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: config.get('RAZORPAY_KEY_ID'),
      key_secret: config.get('RAZORPAY_KEY_SECRET'),
    });
  }
  getInstance(): Razorpay {
    return this.razorpay;
  }
}
