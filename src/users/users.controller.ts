import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('joinus')
  joinus(@Body() userDto: UserDto) {
    return this.userService.joinus(userDto);
  }
}
