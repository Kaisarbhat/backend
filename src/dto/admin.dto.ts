import { isString } from '@nestjs/class-validator';
import { IsEmail, isNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class AdminDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
