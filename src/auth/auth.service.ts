import { ForbiddenException, Injectable } from '@nestjs/common';
import { AdminDto } from 'src/dto/admin.dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prismaService';
import { retry } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(admin: AdminDto) {
    //generating hash of password using argon2
    const hash = await argon.hash(admin.password);

    //saving the user in database
    try {
      const user = await this.prisma.admin.create({
        data: {
          username: admin.username,
          password: hash,
        },
      });

      //returning user
      return user;
    } catch (error) {
      //if user already exists with the username
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials Already Taken');
      }
      throw error;
    }
  }
  async signIn(admin: AdminDto) {
    try {
      //check for username in database
      const user = await this.prisma.admin.findUnique({
        where: {
          username: admin.username,
        },
      });
      //if username is not found
      if (!user) {
        throw new ForbiddenException('Invalid Credentials');
      }

      //check for password match

      const passMatches = await argon.verify(user.password, admin.password);
      if (!passMatches) {
        throw new ForbiddenException('Invalid Credentials');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
