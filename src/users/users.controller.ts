import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UsersService } from './users.service';
import { EventRegistrationDto } from 'src/dto/event.registration.dto';
import { JwtGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //add users to db
  @Post('joinus')
  joinus(@Body() userDto: UserDto) {
    return this.userService.joinus(userDto);
  }
  //registering users for events
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
  //get all users
  @UseGuards(JwtGuard)
  @Get('allusers')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
