import { S3Service } from 'src/admin/upload.to.s3';
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
import AWS from 'aws-sdk';
@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}
  //FEATURES
  //getting all the club members from the database
  async getAllUsers() {
    try {
      return await this.prisma.user.findMany({
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
    file: Express.Multer.File,
    admin: Admin,
    ourFeaturesDto: OurFeaturesDto,
  ): Promise<OurFeaturesResponse> {
    try {
      const imageUrl =
        await this.s3Service.uploadFile(file);
      return await this.prisma.ourFeatures.create({
        data: {
          ...ourFeaturesDto,
          imageUrl: imageUrl,
          createdBy: admin.username,
        },
      });
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
      return await this.prisma.ourFeatures.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  //updating ourFeatures in database
  async updateOurFeature(
    admin: Admin,
    featureId: string,
    updateOurFeaturesDto: UpdateOurFeaturesDto,
    file?: Express.Multer.File,
  ): Promise<OurFeaturesResponse> {
    try {
      let imageUrl: string;
      if (file) {
        imageUrl = await this.s3Service.uploadFile(file);
      }
      return await this.prisma.ourFeatures.update({
        where: { id: featureId },
        data: {
          ...updateOurFeaturesDto,
          imageUrl: imageUrl,
          updatedBy: admin.username,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          `Feature with title : ${updateOurFeaturesDto.title} already exists`,
        );
      }
      if (error.code === 'P2025') {
        throw new ForbiddenException(
          `Feature with Id : ${featureId} Not Found`,
        );
      }
      throw error.code;
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
          `The feature with Id : ${featureId} Not Found`,
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
    file: Express.Multer.File,
  ): Promise<RecentActivitiesDtoResponse> {
    try {
      const imageUrl =
        await this.s3Service.uploadFile(file);
      return await this.prisma.recentActivities.create({
        data: {
          ...recentActivitiesDto,
          imageUrl: imageUrl,
          createdBy: admin.username,
        },
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

  //getting all recentActivities images from database
  async getAllRecentActivities(): Promise<
    RecentActivitiesDtoResponse[]
  > {
    try {
      return await this.prisma.recentActivities.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
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
    file: Express.Multer.File,
  ): Promise<AboutUsDtoResponse> {
    try {
      const ImageUrl =
        await this.s3Service.uploadFile(file);
      return await this.prisma.aboutUs.create({
        data: {
          ...aboutUsDto,
          imageUrl: ImageUrl,
          createdBy: admin.username,
        },
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
      return await this.prisma.aboutUs.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
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
