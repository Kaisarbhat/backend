import {
  EventResponseWithDataDto,
  UpdateEventDataDto,
  UpdateEventDto,
} from './../dto/event.dto';
import {
  Event,
  EventData,
} from './../../node_modules/.prisma/client/index.d';
import {
  CreateEventDataDto,
  CreateEventDto,
  EventDataResponseDto,
  EventResponseDto,
} from 'src/dto/event.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaService';
import { promises } from 'dns';
import { NotFoundError, retry } from 'rxjs';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  // add new events to the database
  async addEvent(
    eventDto: CreateEventDto,
  ): Promise<EventResponseDto> {
    try {
      const event = await this.prisma.event.create({
        data: eventDto,
        include: {
          eventData: true,
        },
      });

      return event;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          'Event  already Exists',
        );
      }
      throw error;
    }
  }

  //add event data

  async addDataToEvent(
    eventId: string,
    eventDto: CreateEventDataDto,
  ): Promise<EventDataResponseDto> {
    try {
      const eventData = await this.prisma.eventData.create({
        data: {
          ...eventDto,
          eventId,
        },
      });
      return eventData;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          'Event Data already Exists',
        );
      }
      throw error;
    }
  }

  //get event based on id
  async getEventData(eventId: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          eventData: true,
        },
      });
      if (!event)
        throw new NotFoundException('Event not found');
      return event;
    } catch (error) {
      throw error;
    }
  }

  //get upcoming events

  async getUpcomingEvents() {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate
      .toISOString()
      .split('T')[0];
    console.log(currentDate, formattedCurrentDate);
    try {
      const events = this.prisma.event.findMany({
        where: {
          date: {
            gte: formattedCurrentDate,
          },
        },
        include: {
          eventData: true,
        },
        orderBy: {
          date: 'asc',
        },
      });
      return events;
    } catch (error) {
      throw error;
    }
  }
  async getPastEvents() {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate
      .toISOString()
      .split('T')[0];
    try {
      const events = await this.prisma.event.findMany({
        where: {
          date: {
            lt: formattedCurrentDate,
          },
        },
        include: {
          eventData: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
      return events;
    } catch (error) {
      throw error;
    }
  }

  //updating events
  async updateEvent(
    eventId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventResponseWithDataDto> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          eventData: true,
        },
      });
      //if event does not exist
      if (!event)
        throw new NotFoundException(
          `Event with ${eventId} not found`,
        );
      //update event data
      const updatedEvent = await this.prisma.event.update({
        where: { id: eventId },
        data: updateEventDto,
      });
      return updatedEvent;
    } catch (error) {
      throw error;
    }
  }

  //update eventData

  async updateEventData(
    eventId: string,
    updateEventDataDto: UpdateEventDataDto,
    eventDataId: string,
  ) {
    try {
      //find the event in database
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        include: { eventData: true },
      });
      //if eventId does not exist
      if (!event) {
        throw new NotFoundException(
          `Event not found with ${eventId} id`,
        );
      }
      //if event data is not present
      //   if (!event.eventData) {
      //     return this.prisma.eventData.create({
      //         data: {
      //           ...updateEventDataDto,
      //           eventId,
      //         },
      //       });
      //   }
      //check for event data
      //   const eventData = await this.prisma.eventData.findUnique({
      //     where : {id : eventDataId}
      //   })

      //update existing eventdata
      return this.prisma.eventData.update({
        where: { id: eventDataId },
        data: {
          ...updateEventDataDto,
          eventId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  //delete events
  async deleteEvent(eventId: string) {
    try {
      //check if event exists
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        include: { eventData: true },
      });

      if (!event) {
        throw new NotFoundException(
          `Event with ${eventId} id not found`,
        );
      }

      //delete the event
      //   return this.prisma.$transaction(async (tx) => {
      //     await tx.eventData.delete({
      //       where: { id: event.eventData?.id },
      //     });
      //     return tx.event.delete({
      //       where: { id: eventId },
      //     });

      return this.prisma.event.delete({
        where: { id: eventId },
      });
    } catch (error) {
      throw error;
    }
  }
}
