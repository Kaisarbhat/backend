import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,11}$/, {
    message: 'Phone Number expected',
  })
  phoneNumber: string;
  @IsString()
  @IsNotEmpty()
  @Matches(/^(A|B|AB|O|a|b|ab|o)[+-]$/, {
    message: 'Blood Group Expected',
  })
  bloodGroup: string;
  @IsNotEmpty()
  @IsBoolean()
  terms: boolean;
  @IsDate()
  @IsOptional()
  createdAt: Date;
}

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  bloodGroup: string;
  createdAt: Date;
}
