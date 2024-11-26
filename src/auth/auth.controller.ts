import { Body, Controller, Post } from '@nestjs/common';
import { AdminDto } from 'src/dto/admin.dto';
import { AuthService } from './auth.service';

@Controller('admin')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() adminDto: AdminDto) {
    return this.authService.signup(adminDto);
  }
  @Post('signin')
  signin(@Body() adminDto: AdminDto) {
    return this.authService.signIn(adminDto);
  }
}
