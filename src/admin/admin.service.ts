import { S3Service } from 'src/admin/upload.to.s3';
import { Admin } from './../../node_modules/.prisma/client/index.d';
import {
  OurFeaturesDto,
  UpdateOurFeaturesDto,
} from './../dto/our.features.dto';
import { PrismaService } from 'src/prisma/prismaService';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OurFeaturesResponse } from 'src/dto/our.features.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

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

  //Hero Image
  async addHeroImage(
    admin: Admin,
    image: Express.Multer.File,
  ) {
    try {
      const existingImage =
        await this.prisma.heroImage.findFirst();
      if (existingImage)
        throw new BadRequestException(
          'Can have only one Hero Image',
        );
      const imageUrl =
        await this.s3Service.uploadFile(image);
      return await this.prisma.heroImage.create({
        data: {
          imageUrl: imageUrl,
          createdBy: admin.username,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Image Already exists',
        );
      }
      throw error;
    }
  }
  //update heroImage
  async updateHeroImage(
    admin: Admin,
    image: Express.Multer.File,
  ) {
    try {
      const existingImage =
        await this.prisma.heroImage.findFirst();
      const { createdBy, createdAt } = existingImage;
      const imageUrl =
        await this.s3Service.uploadFile(image);
      if (imageUrl === existingImage.imageUrl) {
        throw new BadRequestException(
          'You are uploading the same image',
        );
      }
      return await this.prisma.heroImage.update({
        where: { id: existingImage.id },
        data: {
          createdBy: createdBy,
          createdAt: createdAt,
          imageUrl: imageUrl,
          updatedBy: admin.username,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Image Already exists',
        );
      }
      throw error;
    }
  }
  //get heroimage
  async getHeroImage() {
    try {
      return this.prisma.heroImage.findFirst();
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
    file: Express.Multer.File,
  ) {
    try {
      const imageUrl =
        await this.s3Service.uploadFile(file);
      return await this.prisma.recentActivities.create({
        data: {
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
  async getAllRecentActivities() {
    try {
      return await this.prisma.recentActivities.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  //delete recentactivity images
  async deleteRecentActivity(id: string) {
    try {
      const record =
        await this.prisma.recentActivities.findUnique({
          where: { id: id },
        });
      if (!record) {
        throw new BadRequestException(
          'The image does not exist',
        );
      }
      return await this.prisma.recentActivities.delete({
        where: { id: id },
      });
    } catch (error) {
      throw error;
    }
  }

  //recentactivity mobile
  async addRecentActivityMobile(
    admin: Admin,
    image: Express.Multer.File,
  ) {
    try {
      const imageUrl =
        await this.s3Service.uploadFile(image);
      return await this.prisma.recentActivitiesMobile.create(
        {
          data: {
            imageUrl: imageUrl,
            createdBy: admin.username,
          },
        },
      );
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'File Already Exists',
        );
      }
      throw error;
    }
  }
  //delete
  async deleteRecentActivityMobile(id: string) {
    try {
      const record =
        await this.prisma.recentActivitiesMobile.findUnique(
          {
            where: { id: id },
          },
        );
      if (!record) {
        throw new BadRequestException(
          'The image does not exist',
        );
      }
      return this.prisma.recentActivitiesMobile.delete({
        where: { id: id },
      });
    } catch (error) {
      throw error;
    }
  }
  //get All RecentActivities Mobile
  async getAllRecentActicitiesMobile() {
    try {
      return this.prisma.recentActivitiesMobile.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  //adding aboutUs images to db
  async addAboutUs(
    admin: Admin,
    file: Express.Multer.File,
  ) {
    try {
      const ImageUrl =
        await this.s3Service.uploadFile(file);
      return await this.prisma.aboutUs.create({
        data: {
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
  async getAllAboutUs() {
    try {
      return await this.prisma.aboutUs.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  //delete images in aboutus
  async deleteAboutUs(id: string) {
    try {
      const record = await this.prisma.aboutUs.findUnique({
        where: { id: id },
      });
      if (!record) {
        throw new BadRequestException(
          'The image does not exist',
        );
      }
      return await this.prisma.aboutUs.delete({
        where: { id: id },
      });
    } catch (error) {
      throw error;
    }
  }

  //about Us Hero Image
  async addAboutUsHeroImage(
    admin: Admin,
    image: Express.Multer.File,
  ) {
    try {
      const existingImage =
        await this.prisma.aboutUsHeroImage.findFirst();
      if (existingImage)
        throw new BadRequestException(
          'Can have only one Hero Image',
        );
      const imageUrl =
        await this.s3Service.uploadFile(image);
      return await this.prisma.aboutUsHeroImage.create({
        data: {
          imageUrl: imageUrl,
          createdBy: admin.username,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Image Already exists',
        );
      }
      throw error;
    }
  }
  //update heroImage
  async updateAboutUsHeroImage(
    admin: Admin,
    image: Express.Multer.File,
  ) {
    try {
      const existingImage =
        await this.prisma.aboutUsHeroImage.findFirst();
      const { createdBy, createdAt } = existingImage;
      const imageUrl =
        await this.s3Service.uploadFile(image);
      if (imageUrl === existingImage.imageUrl) {
        throw new BadRequestException(
          'You are uploading the same image',
        );
      }
      return await this.prisma.aboutUsHeroImage.update({
        where: { id: existingImage.id },
        data: {
          createdBy: createdBy,
          createdAt: createdAt,
          imageUrl: imageUrl,
          updatedBy: admin.username,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Image Already exists',
        );
      }
      throw error;
    }
  }
  //get heroimage
  async getAboutUsHeroImage() {
    try {
      return this.prisma.aboutUsHeroImage.findFirst();
    } catch (error) {
      throw error;
    }
  }
}
