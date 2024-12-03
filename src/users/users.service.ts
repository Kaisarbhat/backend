import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserDto, UserResponseDto } from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma/prismaService';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}
  //adding users to club
  async joinus(userDto: UserDto): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.create({
        data: userDto,
      });
      const email = this.mailerService.sendMail({
        to: `${userDto.email}`,
        from: 'ctc@gmail.com',
        subject: 'Email testing',
        html: '<b>Congratulation for joining  CTC</b>',
      });
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
  async sendMail() {
    return await this.mailerService.sendMail({
      to: 'kaisar@inbox.mailtrap.io',
      from: 'kaisra@gmail.com',
      subject: 'Email testing',
      html: '<b>Email send </b>',
    });
  }
}
