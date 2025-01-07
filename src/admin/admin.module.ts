import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { S3Service } from './upload.to.s3';

@Module({
  imports: [PassportModule, AuthModule],
  providers: [AdminService, JwtStrategy, S3Service],
  controllers: [AdminController],
  exports: [AdminService, S3Service],
})
export class AdminModule {}
