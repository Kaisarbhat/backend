import { EmailService } from './email.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserDto, UserResponseDto } from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma/prismaService';
import { EventRegistrationDto } from 'src/dto/event.registration.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  //adding users to club
  async joinus(userDto: UserDto): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.create({
        data: userDto,
      });
      //sending mail after successfull registration
      await this.emailService.sendMembershipConfirmation(
        userDto.email,
        userDto.name,
      );
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            `User with ${userDto.email} already exits `,
          );
        }
      }
    }
  }

  //register for event
  async registerForEvent(
    dto: EventRegistrationDto,
    eventId: string,
    paymentId: string,
    txClient?: any,
  ) {
    const prismaClient = txClient || this.prisma;

    try {
      if (dto.joinClub) {
        // Handle club membership
        const user = await this.findOrCreateUser(
          dto,
          prismaClient,
        );

        // Create event registration
        const registration =
          await prismaClient.registrationData.create({
            data: {
              ...dto,
              eventId,
              paymentId,
            },
          });

        // Send emails outside the transaction
        setImmediate(async () => {
          try {
            await this.emailService.sendMembershipConfirmation(
              dto.email,
              dto.firstName,
            );
            const event =
              await this.prisma.event.findUnique({
                where: { id: registration.eventId },
              });
            await this.emailService.eventRegistrationConfirmation(
              event,
              registration.firstName,
              registration.email,
            );
          } catch (error) {
            throw new Error(
              `Email sending failed : ${error}`,
            );
          }
        });
        return { registration, user };
      } else {
        // Simple event registration without club joining
        const registration =
          await prismaClient.registrationData.create({
            data: {
              ...dto,
              eventId,
              paymentId,
            },
          });

        // Send email outside the transaction
        setImmediate(async () => {
          try {
            const event =
              await this.prisma.event.findUnique({
                where: { id: registration.eventId },
              });
            await this.emailService.eventRegistrationConfirmation(
              event,
              registration.firstName,
              registration.email,
            );
          } catch (error) {
            throw new Error(
              `Email sending failed : ${error}`,
            );
          }
        });

        return { registration };
      }
    } catch (error) {
      if (
        error instanceof
        Prisma.PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'User has already registered for this event',
          );
        }
      }
      throw error;
    }
  }

  private async findOrCreateUser(
    dto: EventRegistrationDto,
    prismaClient: any,
  ) {
    const existingUser = await prismaClient.user.findUnique(
      {
        where: { email: dto.email },
      },
    );

    if (existingUser) {
      return existingUser;
    }

    return await prismaClient.user.create({
      data: {
        name: `${dto.firstName} ${dto.lastName}`,
        email: dto.email,
        phoneNumber: dto.mobile,
        bloodGroup: dto.bloodGroup,
        terms: true,
      },
    });
  }

  //checking for existing registration
  async checkregistration(email: string, eventId: string) {
    try {
      const registration =
        await this.prisma.registrationData.findFirst({
          where: {
            email,
            eventId,
          },
        });
      return { exists: !!registration };
    } catch (error) {
      throw new BadRequestException(
        'Failed to check registration status : ',
        error,
      );
    }
  }
}
