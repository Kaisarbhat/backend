import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from 'src/admin/admin.module';
import { S3Service } from 'src/admin/upload.to.s3';
@Module({
  imports: [PassportModule, AdminModule],
  controllers: [EventsController],
  providers: [EventsService, S3Service],
})
export class EventsModule {}
