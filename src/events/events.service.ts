import { EventRegistrationDto } from './../dto/event.registration.dto';
import {
  CreateEventWithDataDto,
  UpdateEventWithDataDto,
} from './../dto/event.dto';
import { EventResponseDto } from 'src/dto/event.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaService';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Admin } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  // // add new events to the database
  // async addEvent(
  //   eventDto: CreateEventDto,
  // ): Promise<EventResponseDto> {
  //   try {
  //     const event = await this.prisma.event.create({
  //       data: eventDto,
  //       include: {
  //         eventData: true,
  //       },
  //     });

  //     return event;
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       if (error.code === 'P2002') {
  //         throw new ForbiddenException(
  //           `User with ${eventDto.name} already exits `,
  //         );
  //       }
  //     }
  //     throw error;
  //   }
  // }

  // //add event data
  // async addDataToEvent(
  //   eventId: string,
  //   eventDto: CreateEventDataDto,
  // ): Promise<EventDataResponseDto> {
  //   try {
  //     const eventData = await this.prisma.eventData.create({
  //       data: {
  //         ...eventDto,
  //         eventId,
  //       },
  //     });
  //     return eventData;
  //   } catch (error) {
  //     if (error.code === 'P2002') {
  //       throw new ForbiddenException(
  //         'Event Data already Exists',
  //       );
  //     }
  //     throw error;
  //   }
  // }

  async createEventWithData(
    admin: Admin,
    createEventWithDataDto: CreateEventWithDataDto,
  ): Promise<EventResponseDto> {
    try {
      // Validate the input data
      if (
        !createEventWithDataDto?.event ||
        !createEventWithDataDto?.eventData
      ) {
        throw new Error(
          'Invalid input: Both event and eventData are required',
        );
      }

      const eventWithData = await this.prisma.$transaction(
        async (tx) => {
          // Create the event first
          const event = await tx.event.create({
            data: {
              ...createEventWithDataDto.event,
              createdBy: admin.username,
            },
          });

          // Create the event data with the new event ID
          const eventData = await tx.eventData.create({
            data: {
              ...createEventWithDataDto.eventData,
              eventId: event.id,
            },
          });

          return {
            ...event,
            eventData,
          };
        },
      );

      return eventWithData;
    } catch (error) {
      // error handling
      if (error instanceof PrismaClientValidationError) {
        throw new Error(
          'Invalid data structure: ' + error.message,
        );
      }
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          `Event with name ${createEventWithDataDto.event.name} already exists`,
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
        throw new NotFoundException(
          `Event with ${eventId} :  id not found`,
        );
      return event;
    } catch (error) {
      throw error;
    }
  }

  //get all events
  async getAllEvents() {
    try {
      const allEvents = await this.prisma.event.findMany({
        include: {
          eventData: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
      return allEvents;
    } catch (error) {
      throw error;
    }
  }

  //get upcoming events

  async getUpcomingEvents() {
    const currentDate = new Date()
      .toISOString()
      .split('T')[0];

    try {
      const events = this.prisma.event.findMany({
        where: {
          date: {
            gte: currentDate,
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

  //past events
  async getPastEvents() {
    const currentDate = new Date()
      .toISOString()
      .split('T')[0];

    try {
      const events = await this.prisma.event.findMany({
        where: {
          date: {
            lt: currentDate,
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
    admin: Admin,
    eventId: string,
    updateEventWithDataDto: UpdateEventWithDataDto,
  ) {
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
          `Event with id : ${eventId} not found`,
        );
      //update event data
      const updatedEvent = await this.prisma.$transaction(
        async (tx) => {
          const updatedEvent = await tx.event.update({
            where: { id: eventId },
            data: {
              ...updateEventWithDataDto.event,
              updatedBy: admin.username,
            },
          });
          const updatedEventData =
            await tx.eventData.update({
              where: { id: event.eventData.id },
              data: {
                ...updateEventWithDataDto.eventData,
                eventId: updatedEvent.id,
              },
            });
          return {
            ...updatedEvent,
            updatedEventData,
          };
        },
      );
      return updatedEvent;
    } catch (error) {
      throw error;
    }
  }

  //update eventData

  // async updateEventData(
  //   eventId: string,
  //   updateEventDataDto: UpdateEventDataDto,
  //   eventDataId: string,
  // ) {
  //   try {
  //     //find the event in database
  //     const event = await this.prisma.event.findUnique({
  //       where: { id: eventId },
  //       include: { eventData: true },
  //     });
  //     //if eventId does not exist
  //     if (!event) {
  //       throw new NotFoundException(
  //         `Event not found with ${eventId} id`,
  //       );
  //     }
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
  //     return this.prisma.eventData.update({
  //       where: { id: eventDataId },
  //       data: {
  //         ...updateEventDataDto,
  //         eventId,
  //       },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //register for events
  async registerForEvent(
    eventId: string,
    eventRegistrationDto: EventRegistrationDto,
  ) {
    let userExists = true;
    try {
      //use transaction if the user wants to join the club also
      const registerUser = await this.prisma.$transaction(
        async (tx) => {
          //registering the user for event
          const registerUserForEvent =
            await tx.registrationData.create({
              data: { ...eventRegistrationDto, eventId },
            });
          if (eventRegistrationDto.joinClub) {
            const name =
              eventRegistrationDto.firstName +
              ' ' +
              eventRegistrationDto.lastName;
            //joining the user in the club
            const joinUser = await tx.user.create({
              data: {
                name: name,
                email: eventRegistrationDto.email,
                phoneNumber: eventRegistrationDto.mobile,
                bloodGroup: eventRegistrationDto.bloodGroup,
              },
            });
            userExists = false;
            //return user with join club
            return {
              ...registerUserForEvent,
              joinUser,
            };
          }
          //return only registration data
          return { registerUserForEvent };
        },
      );
      return registerUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        //duplicate key error
        if (error.code === 'P2002') {
          if (userExists) {
            //need to be handled
            throw new ForbiddenException(
              'User already exists',
            );
          } else
            throw new ForbiddenException(
              'One User Can Register Only one time for one Event',
            );
        }
        //transaction failed error
        else if (error.code === 'P2004') {
          throw new BadRequestException(
            'Transaction Failed',
          );
        }
      }
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
      //if event does not exist
      if (!event) {
        throw new NotFoundException(
          `Event with id : ${eventId}  not found`,
        );
      }
      //return deleted event
      return this.prisma.event.delete({
        where: { id: eventId },
      });
    } catch (error) {
      throw error;
    }
  }
}
