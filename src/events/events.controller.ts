import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/auth.guard';
import {
  CreateEventDto,
  UpdateEventDto,
} from 'src/dto/event.dto';
import { EventsService } from './events.service';
import { EventRegistrationDto } from 'src/dto/event.registration.dto';
import { GetUser } from 'src/auth/get-user';
import { Admin } from '@prisma/client';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) {}
  @Post('createEventWithData')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
    ]),
  )
  async createEventWithData(
    @GetUser() admin: Admin,
    @UploadedFiles()
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
      file3?: Express.Multer.File[];
    },
    @Body() createEventDto: CreateEventDto,
  ) {
    return this.eventService.createEvent(
      admin,
      files,
      createEventDto,
    );
  }

  //handler for getting event Data
  @Get('event/:id')
  getEventData(@Param('id') id: string) {
    return this.eventService.getEventData(id);
  }
  //Get all events
  @Get('allEvents')
  getAllEvents() {
    return this.eventService.getAllEvents();
  }
  //handler for getting upcoming events
  @Get('upcomingevents')
  getUpcomingEvents() {
    return this.eventService.getUpcomingEvents();
  }
  //handler for getting pastevents
  @Get('pastevents')
  getPastEvents() {
    return this.eventService.getPastEvents();
  }
  //update event
  @Put('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
    ]),
  )
  updateEvent(
    @GetUser() admin: Admin,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFiles()
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
      file3?: Express.Multer.File[];
    },
  ) {
    return this.eventService.updateEvent(
      admin,
      id,
      files,
      updateEventDto,
    );
  }

  @Delete('delete/:id')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
