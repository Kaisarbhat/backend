import { isString } from '@nestjs/class-validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class UpdateAdminDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
  @IsString()
  @IsNotEmpty()
  newPassword: string;
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
