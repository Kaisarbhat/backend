import { PrismaService } from 'src/prisma/prismaService';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async getAllUsers() {
    try {
      return this.prisma.user.findMany({
        orderBy: {
          name: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
