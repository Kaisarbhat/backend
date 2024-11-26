import { ForbiddenException, Injectable } from '@nestjs/common';
import { AdminDto } from 'src/dto/admin.dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prismaService';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
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
      return this.signToken(user.id, user.username);
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

      const passMatches = await argon.verify(
        user.password,
        admin.password,
      );
      if (!passMatches) {
        throw new ForbiddenException('Invalid Credentials');
      }
      return this.signToken(user.id, user.username);
    } catch (error) {
      throw error;
    }
  }

  //generating jwt
  secret = this.config.get('JWT_SECRET');
  async signToken(
    userId: string,
    username: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      username,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.secret,
    });
    return {
      access_token: token,
    };
  }
}
