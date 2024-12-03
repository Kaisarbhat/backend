import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsString()
  @IsOptional()
  updatedBy: string;
  @IsString()
  @IsOptional()
  updatedAt: string;
}
