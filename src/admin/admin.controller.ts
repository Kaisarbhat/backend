import { JwtGuard } from 'src/auth/auth.guard';
import { AdminService } from './admin.service';
import { Controller, Get, UseGuards } from '@nestjs/common';

//@UseGuards(JwtGuard)
@Controller('adminservices')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Get('allusers')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }
}
