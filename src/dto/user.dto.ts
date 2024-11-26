import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

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
}
