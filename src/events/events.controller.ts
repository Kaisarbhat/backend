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
import { JwtGuard } from 'src/auth/auth.guard';
import {
  CreateEventWithDataDto,
  UpdateEventWithDataDto,
} from 'src/dto/event.dto';
import { EventsService } from './events.service';
import { EventRegistrationDto } from 'src/dto/event.registration.dto';

@UseGuards(JwtGuard)
@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) {}

  //handler for adding new events to db
  // @Post('addevent')
  // addEvent(@Body() eventDto: CreateEventDto) {
  //   console.log(eventDto);
  //   return this.eventService.addEvent(eventDto);
  // }
  @Post('createEventWithData')
  // @UsePipes(new ValidationPipe({ transform: true }))
  async createEventWithData(
    @Body() createEventWithDataDto: CreateEventWithDataDto,
  ) {
    return this.eventService.createEventWithData(
      createEventWithDataDto,
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
  updateEvent(
    @Param('id') id: string,
    @Body() updateEventWithDataDto: UpdateEventWithDataDto,
  ) {
    return this.eventService.updateEvent(
      id,
      updateEventWithDataDto,
    );
  }
  @Post('register/:id')
  registerForEvent(
    @Param('id') id: string,
    @Body() eventRegistrationDto: EventRegistrationDto,
  ) {
    return this.eventService.registerForEvent(
      id,
      eventRegistrationDto,
    );
  }

  //handler for adding data to an event
  // @Post(':id/data')
  // addDataToEvent(
  //   @Param('id') id: string,
  //   @Body() eventData: CreateEventDataDto,
  // ) {
  //   return this.eventService.addDataToEvent(id, eventData);
  // }

  //update Event data
  // @Put(':eid/eventData/:edid')
  // updateEventData(
  //   @Param('eventId') eventId: string,
  //   @Body() updateEventDataDto: UpdateEventDataDto,
  //   @Param('eventDataId') eventDataId: string,
  // ) {
  //   return this.eventService.updateEventData(
  //     eventId,
  //     updateEventDataDto,
  //     eventDataId,
  //   );
  // }
  @Delete('delete/:id')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
