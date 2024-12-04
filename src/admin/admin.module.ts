import { Module } from '@nestjs/common';
import { Admin } from './admin';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  imports: [PassportModule, AuthModule],
  providers: [AdminService, JwtStrategy],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
