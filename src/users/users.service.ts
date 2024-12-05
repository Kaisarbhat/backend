import { EmailService } from './email.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserDto, UserResponseDto } from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma/prismaService';
import { MailerService } from '@nestjs-modules/mailer';
import { EventRegistrationDto } from 'src/dto/event.registration.dto';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
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

  //sending email to joined users
  async sendEmail(
    to: string,
    from: string,
    subject: string,
    html: string,
  ) {
    return await this.mailerService.sendMail({
      to: to,
      from: from,
      subject: subject,
      html: html,
    });
  }

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
            userExists = false;
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
}
