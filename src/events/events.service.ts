import { AdminService } from './../admin/admin.service';
import { EventRegistrationDto } from './../dto/event.registration.dto';
import {
  CreateEventDto,
  UpdateEventDto,
} from './../dto/event.dto';
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
import { Admin, Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private adminService: AdminService,
  ) {}

  //creating the event
  async createEvent(
    admin: Admin,
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
      file3?: Express.Multer.File[];
    },
    createEventDto: CreateEventDto,
  ) {
    try {
      // Destructuring for easy access
      const [file1, file2, file3] = [
        files.file1?.[0],
        files.file2?.[0],
        files.file3?.[0],
      ];

      // If any required files are missing, throw an error
      if (!file1 || !file2 || !file3) {
        throw new Error(
          'All files (file1, file2, file3) must be provided.',
        );
      }

      // Promise.all to upload files in parallel for better performance
      const [
        eventImageUrl,
        middleImageUrl,
        bottomImageUrl,
      ] = await Promise.all([
        this.adminService.uploadFile(file1),
        this.adminService.uploadFile(file2),
        this.adminService.uploadFile(file3),
      ]);

      // Create the event and save to the database
      return await this.prisma.event.create({
        data: {
          ...createEventDto,
          createdBy: admin.username,
          eventImageUrl,
          middleImageUrl,
          bottomImageUrl,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          `Event with ${createEventDto.name} Already exists`,
        );
      }
      throw new Error(
        `Failed to create event: ${error.message}`,
      );
    }
  }

  //get event based on id
  async getEventData(eventId: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId,
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
      return await this.prisma.event.findMany({
        orderBy: {
          date: 'desc',
        },
      });
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
      return await this.prisma.event.findMany({
        where: {
          date: {
            gte: currentDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });
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
      return await this.prisma.event.findMany({
        where: {
          date: {
            lt: currentDate,
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  //updating events
  async updateEvent(
    admin: Admin,
    eventId: string,
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
      file3?: Express.Multer.File[];
    },
    updateEventDto: UpdateEventDto,
  ) {
    try {
      // Destructuring files for easy access
      const [file1, file2, file3] = [
        files.file1?.[0],
        files.file2?.[0],
        files.file3?.[0],
      ];

      // Fetch the event to be updated
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
      });

      // If the event does not exist, throw a NotFoundException
      if (!event) {
        throw new NotFoundException(
          `Event with id: ${eventId} not found`,
        );
      }

      // Prepare the data for updating, including the updateEventDto
      const updatedData: any = {
        ...updateEventDto,
        updatedBy: admin.username,
      };

      // Handle file uploads if provided
      if (file1) {
        updatedData.eventImageUrl =
          await this.adminService.uploadFile(file1);
      }

      if (file2) {
        updatedData.middleImageUrl =
          await this.adminService.uploadFile(file2);
      }

      if (file3) {
        updatedData.bottomImageUrl =
          await this.adminService.uploadFile(file3);
      }

      // Update the event with the prepared data
      return await this.prisma.event.update({
        where: { id: eventId },
        data: updatedData,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Failed to update event: ${error.message}`,
      );
    }
  }

  //delete event based on id
  async deleteEvent(eventId: string) {
    try {
      // Check if event exists before attempting to delete
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
      });

      // If event does not exist, throw NotFoundException
      if (!event) {
        throw new NotFoundException(
          `Event with id: ${eventId} not found`,
        );
      }

      // Delete the event and return the deleted event data
      const deletedEvent = await this.prisma.event.delete({
        where: { id: eventId },
      });
      return {
        message: `Event with id: ${eventId} deleted successfully`,
        deletedEvent,
      };
    } catch (error) {
      // Handle Prisma client error and provide a meaningful message
      if (
        error instanceof
        Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error(`Prisma error: ${error.message}`);
      }
      throw new ForbiddenException(
        `Failed to delete event: ${error.message || error}`,
      );
    }
  }
}
