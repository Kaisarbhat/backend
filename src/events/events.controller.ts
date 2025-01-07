import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { GetUser } from 'src/auth/get-user';
import { Admin } from '@prisma/client';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) {}

  @UseGuards(JwtGuard)
  @Post('createEventWithData')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
      { name: 'file4', maxCount: 1 },
      { name: 'file5', maxCount: 1 },
    ]),
  )
  async createEventWithData(
    @GetUser() admin: Admin,
    @UploadedFiles()
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
      file3?: Express.Multer.File[];
      file4?: Express.Multer.File[];
      file5?: Express.Multer.File[];
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
  @UseGuards(JwtGuard)
  @Put('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
      { name: 'file4', maxCount: 1 },
      { name: 'file5', maxCount: 1 },
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
      file4?: Express.Multer.File[];
      file5?: Express.Multer.File[];
    },
  ) {
    return this.eventService.updateEvent(
      admin,
      id,
      files,
      updateEventDto,
    );
  }

  //Delete Events
  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }

  //Get Recent Event
  @Get('recentevent')
  getRecentEvent() {
    return this.eventService.getRecentEvent();
  }
}
