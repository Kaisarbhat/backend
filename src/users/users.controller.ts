import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //add users to db
  @Post('joinus')
  joinus(@Body() userDto: UserDto) {
    return this.userService.joinus(userDto);
  }
  //send email to joined users
  @Get('joinus')
  sendEmail() {
    return this.userService.sendMail();
  }
}
