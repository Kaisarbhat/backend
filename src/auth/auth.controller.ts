import {
  Body,
  Controller,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  AdminDto,
  UpdateAdminDto,
} from 'src/dto/admin.dto';
import { AuthService } from './auth.service';

@Controller('admin')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('SignUp')
  signup(@Body() adminDto: AdminDto) {
    return this.authService.signup(adminDto);
  }
  @Post('Login')
  signin(@Body() adminDto: AdminDto) {
    return this.authService.signIn(adminDto);
  }
  @Put('update/:username')
  update(
    @Param('username') username: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.authService.update(
      username,
      updateAdminDto,
    );
  }
}
