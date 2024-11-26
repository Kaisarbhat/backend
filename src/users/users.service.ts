import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma/prismaService';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  joinus(userDto: UserDto) {
    try {
      const user = this.prisma.user.create({
        data: {
          name: userDto.name,
          email: userDto.email,
          phoneNumber: userDto.phoneNumber,
          bloodGroup: userDto.bloodGroup,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}
