import {
  AboutUsDto,
  AboutUsDtoResponse,
} from './../dto/aboutUs.dto';
import {
  RecentActivitiesDto,
  RecentActivitiesDtoResponse,
} from 'src/dto/recentActivities.dto';
import { Admin } from './../../node_modules/.prisma/client/index.d';
import {
  OurFeaturesDto,
  UpdateOurFeaturesDto,
} from './../dto/our.features.dto';
import { PrismaService } from 'src/prisma/prismaService';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OurFeaturesResponse } from 'src/dto/our.features.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  //FEATURES
  //getting all the club members from the database
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

  //adding ourFeatures to database
  async addOurFeatures(
    admin: Admin,
    ourFeaturesDto: OurFeaturesDto,
  ): Promise<OurFeaturesResponse> {
    try {
      const ourFeature =
        await this.prisma.ourFeatures.create({
          data: {
            ...ourFeaturesDto,
            createdBy: admin.username,
          },
        });
      return ourFeature;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          `Feature with title : ${ourFeaturesDto.title} already exists`,
        );
      }
      throw error;
    }
  }

  //getting all the features from the database
  async getAllFeatures(): Promise<
    Array<OurFeaturesResponse>
  > {
    try {
      const allFeatures =
        await this.prisma.ourFeatures.findMany({
          orderBy: {
            updatedAt: 'desc',
          },
        });
      return allFeatures;
    } catch (error) {
      throw error;
    }
  }

  //updating ourFeatures in database
  async updateOurFeature(
    admin: Admin,
    featureId: string,
    updateOurFeaturesDto: UpdateOurFeaturesDto,
  ): Promise<OurFeaturesResponse> {
    try {
      const updatedFeature =
        await this.prisma.ourFeatures.update({
          where: { id: featureId },
          data: {
            ...updateOurFeaturesDto,
            updatedBy: admin.username,
          },
        });
      return updatedFeature;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          `Feature with title : ${updateOurFeaturesDto.title} already exists`,
        );
      }
      throw error;
    }
  }

  //deleting feature
  async deleteFeature(featureId: string) {
    try {
      return await this.prisma.ourFeatures.delete({
        where: { id: featureId },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException(
          `The feature with ${featureId} does not exist`,
        );
      }
      throw error;
    }
  }

  //RECENTACTIVITIES
  //adding recentactivities images to database
  async addRecentActivities(
    admin: Admin,
    recentActivitiesDto: RecentActivitiesDto,
  ): Promise<RecentActivitiesDtoResponse> {
    try {
      const recentActivity =
        await this.prisma.recentActivities.create({
          data: {
            ...recentActivitiesDto,
            createdBy: admin.username,
          },
        });
      return recentActivity;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          `This image already exists`,
        );
      }
      throw error;
    }
  }

  //getting all recentActivities images from database
  async getAllRecentActivities(): Promise<
    RecentActivitiesDtoResponse[]
  > {
    try {
      const allRecentActivities =
        await this.prisma.recentActivities.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
      return allRecentActivities;
    } catch (error) {
      throw error;
    }
  }

  //delete recentactivity images
  async deleteRecentActivity(id: string) {
    try {
      return await this.prisma.recentActivities.delete({
        where: { id: id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException(
          `The image does not exist`,
        );
      }
      throw error;
    }
  }

  //adding aboutUs images to db
  async addAboutUs(
    admin: Admin,
    aboutUsDto: AboutUsDto,
  ): Promise<AboutUsDtoResponse> {
    try {
      return await this.prisma.aboutUs.create({
        data: { ...aboutUsDto, createdBy: admin.username },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          `This image already exists`,
        );
      }
      throw error;
    }
  }

  //get all aboutus images from db
  async getAllAboutUs(): Promise<AboutUsDtoResponse[]> {
    try {
      return await this.prisma.aboutUs.findMany({});
    } catch (error) {
      throw error;
    }
  }

  //delete images in aboutus
  async deleteAboutUs(id: string) {
    try {
      return await this.prisma.aboutUs.delete({
        where: { id: id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException(
          `The image does not exist`,
        );
      }
      throw error;
    }
  }
}
