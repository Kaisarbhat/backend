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
import { JwtGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //add users to db
  @Post('joinus')
  joinus(@Body() userDto: UserDto) {
    return this.userService.joinus(userDto);
  }

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
  //get all users
  @UseGuards(JwtGuard)
  @Get('allusers')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
