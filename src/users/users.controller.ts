import {
  Body,
  Controller,
  Get,
  Param,
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

  //checking existing registration for an event by a user
  @Get('registration/:eventId/:email')
  async checkExistingRegistration(
    @Param('eventId') eventId: string,
    @Param('email') email: string,
  ) {
    return this.userService.checkregistration(
      email,
      eventId,
    );
  }
}
