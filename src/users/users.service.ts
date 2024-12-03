import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserDto } from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma/prismaService';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async joinus(userDto: UserDto) {
    try {
      const user = await this.prisma.user.create({
        data: userDto,
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
}
