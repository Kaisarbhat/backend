import { ImageUri } from './../../node_modules/aws-sdk/clients/emrserverless.d';
import { SecretAccessKey } from './../../node_modules/aws-sdk/clients/codepipeline.d';
import { MimeType } from './../../node_modules/aws-sdk/clients/bedrockagentruntime.d';
import { CreateBucketAccessKeyResult } from './../../node_modules/aws-sdk/clients/lightsail.d';
import { ContentDisposition } from './../../node_modules/aws-sdk/clients/s3.d';
import { Key } from './../../node_modules/aws-sdk/clients/appflow.d';
import { Bucket } from './../../node_modules/aws-sdk/clients/cloudsearchdomain.d';
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
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}
  //AWS Details and connecting to s3 bucket
  s3 = new AWS.S3({
    accessKeyId: this.config.get('ACCESS_KEY_ID'),
    secretAccessKey: this.config.get('SECRET_ACCESS_KEY'),
  });
  AWS_S3_BUCKET = 'chennaitrailclub1';
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
      const imageUrl = await this.uploadFile(file);
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
          updatedAt: 'desc',
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
        imageUrl = await this.uploadFile(file);
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
      const imageUrl = await this.uploadFile(file);
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
      const ImageUrl = await this.uploadFile(file);
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

  async uploadFile(file) {
    const { originalname } = file;

    return await this.upload_To_S3(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  //uploading data to aws-s3-bucket
  async upload_To_S3(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketAccessKeyResult: {
        LocationConstraint: 'ap-south-1',
      },
    };
    try {
      const s3Response = await this.s3
        .upload(params)
        .promise();
      return s3Response.Location;
    } catch (error) {
      throw error;
    }
  }
}
