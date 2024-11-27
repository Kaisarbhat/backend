import { UpdateEventDataDto } from './../dto/event.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Admin } from '@prisma/client';
import { JwtGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user';
import {
  CreateEventDataDto,
  CreateEventDto,
  UpdateEventDto,
} from 'src/dto/event.dto';
import { EventsService } from './events.service';

//@UseGuards(JwtGuard)
@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) {}

  //handler for adding new events to db
  @Post('addevent')
  addEvent(@Body() eventDto: CreateEventDto) {
    console.log(eventDto);
    return this.eventService.addEvent(eventDto);
  }

  //handler for getting event Data

  @Get(':id/event')
  getEventData(@Param('id') id: string) {
    return this.eventService.getEventData(id);
  }
  //handler for getting upcoimg events
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
  @Put(':id/data')
  updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateEvent(
      id,
      updateEventDto,
    );
  }

  //handler for adding data to an event
  @Post(':id/data')
  addDataToEvent(
    @Param('id') id: string,
    @Body() eventData: CreateEventDataDto,
  ) {
    return this.eventService.addDataToEvent(id, eventData);
  }

  //update Event data
  @Put(':eid/eventData/:edid')
  updateEventData(
    @Param('eventId') eventId: string,
    @Body() updateEventDataDto: UpdateEventDataDto,
    @Param('eventDataId') eventDataId: string,
  ) {
    return this.eventService.updateEventData(
      eventId,
      updateEventDataDto,
      eventDataId,
    );
  }
  @Delete(':id/event')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
