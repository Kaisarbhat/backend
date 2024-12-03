import { UpdateAdminDto } from './../dto/admin.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async signup(
    admin: AdminDto,
  ): Promise<{ access_token: string }> {
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
        throw new ForbiddenException(
          'Credentials Already Taken',
        );
      }
      throw error;
    }
  }
  async signIn(
    admin: AdminDto,
  ): Promise<{ access_token: string }> {
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
  async update(
    username: string,
    updateAdminDto: UpdateAdminDto,
  ) {
    try {
      //check for username in database
      const admin = await this.prisma.admin.findUnique({
        where: { username: username },
      });
      if (!admin)
        throw new NotFoundException(
          `Admin with username :  ${username} not found`,
        );
      //check password
      const passMatches = await argon.verify(
        admin.password,
        updateAdminDto.oldPassword,
      );
      //if password is wrong
      if (!passMatches)
        throw new ForbiddenException('Incorrect Password');
      if (
        updateAdminDto.newPassword !==
        updateAdminDto.confirmPassword
      ) {
        throw new ForbiddenException(
          'Passwords do not Match',
        );
      }
      //creating has hof new password
      const newPass = await argon.hash(
        updateAdminDto.newPassword,
      );
      //check if old and new Passwords are the same
      const samePass = await argon.verify(
        admin.password,
        updateAdminDto.newPassword,
      );
      if (samePass) {
        throw new ForbiddenException(
          `Old and New Passwords can't be same `,
        );
      }

      return this.prisma.admin.update({
        where: { username: username },
        data: { password: newPass },
      });
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
      expiresIn: '24h',
      secret: this.secret,
    });
    return {
      access_token: token,
    };
  }
}
