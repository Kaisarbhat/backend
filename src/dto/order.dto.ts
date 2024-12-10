import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class OrderDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  @IsString()
  @IsOptional()
  currency?: string;
}

export class PaymentVerificationDto {
  orderCreationId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}
