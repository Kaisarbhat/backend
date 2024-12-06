import {
  IsCurrency,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class OrderDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  @IsCurrency()
  @IsNotEmpty()
  currency: string;
}
