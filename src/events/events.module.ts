import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [PassportModule, AdminModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
