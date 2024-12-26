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
      await this.emailService.sendRegistrationConfirmation(
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

  //Check if the user already registered for an event
  private async checkExistingRegistration(
    email: string,
    eventId: string,
  ) {
    const existingRegistration =
      await this.prisma.registrationData.findFirst({
        where: {
          email,
          eventId,
        },
      });
    console.log(existingRegistration);

    if (existingRegistration) {
      throw new ForbiddenException(
        'User has already registered for this event',
      );
    }
  }

  private async findOrCreateUser(
    dto: EventRegistrationDto,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      return existingUser;
    }

    return await this.prisma.user.create({
      data: {
        name: `${dto.firstName} ${dto.lastName}`,
        email: dto.email,
        phoneNumber: dto.mobile,
        bloodGroup: dto.bloodGroup,
        terms: true,
      },
    });
  }

  //register for event
  async registerForEvent(
    eventId: string,
    dto: EventRegistrationDto,
  ) {
    try {
      // First check if user is already registered for this event
      await this.checkExistingRegistration(
        dto.email,
        eventId,
      );

      // If user wants to join club, we need to handle user creation/lookup
      if (dto.joinClub) {
        return await this.prisma.$transaction(
          async (tx) => {
            // Create or get existing user
            const user = await this.findOrCreateUser(dto);

            // Create event registration
            const registration =
              await tx.registrationData.create({
                data: {
                  ...dto,
                  eventId,
                },
              });

            return {
              registration,
              user,
            };
          },
        );
      } else {
        // Simple event registration without club joining
        const registration =
          await this.prisma.registrationData.create({
            data: {
              ...dto,
              eventId,
            },
          });

        return { registration };
      }
    } catch (error) {
      if (
        error instanceof
        Prisma.PrismaClientKnownRequestError
      ) {
        // Handle unique constraint violations
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'User has already registered for this event',
          );
        }
        // Handle transaction failures
        if (error.code === 'P2034') {
          throw new BadRequestException(
            'Transaction failed, please try again',
          );
        }
      }
      throw error;
    }
  }
  async getAllUsers() {
    try {
      return this.prisma.user.findMany({
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
