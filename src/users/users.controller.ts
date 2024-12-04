import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UsersService } from './users.service';
import { EventRegistrationDto } from 'src/dto/event.registration.dto';

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
  @Post('register/:id')
  registerForEvent(
    @Param('id') id: string,
    @Body() eventRegistrationDto: EventRegistrationDto,
  ) {
    return this.userService.registerForEvent(
      id,
      eventRegistrationDto,
    );
  }
}
