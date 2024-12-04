import {
  OurFeaturesDto,
  UpdateOurFeaturesDto,
} from './../dto/our.features.dto';
import { JwtGuard } from 'src/auth/auth.guard';
import { AdminService } from './admin.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/get-user';
import { Admin } from '@prisma/client';
import { RecentActivitiesDto } from 'src/dto/recentActivities.dto';
import { AboutUsDto } from 'src/dto/aboutUs.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('adminservices')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //getting all the club members
  @Get('allusers')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  //handler for adding Our Features
  @Post('ourfeatures')
  @UseInterceptors(FileInterceptor('file'))
  addFeatures(
    @GetUser() admin: Admin,
    @UploadedFile() image: Express.Multer.File,
    @Body() ourFeaturesDto: OurFeaturesDto,
  ) {
    return this.adminService.addOurFeatures(
      image,
      admin,
      ourFeaturesDto,
    );
  }

  //get all features
  @Get('ourfeatures')
  getAllFeatures() {
    return this.adminService.getAllFeatures();
  }

  //update ourFeature
  @Put('ourfeatures/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateOurFeature(
    @GetUser() admin: Admin,
    @Param('id') id: string,
    @Body() updateOurFeaturesDto: UpdateOurFeaturesDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.adminService.updateOurFeature(
      admin,
      id,
      updateOurFeaturesDto,
      image,
    );
  }

  //delete feature
  @Delete('ourfeatures/:id')
  deleteFeature(@Param('id') id: string) {
    return this.adminService.deleteFeature(id);
  }

  //adding recent activities
  @Post('recentactivities')
  @UseInterceptors(FileInterceptor('file'))
  addrecentActivity(
    @GetUser() admin: Admin,
    @Body() recentActivitiesDto: RecentActivitiesDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminService.addRecentActivities(
      admin,
      recentActivitiesDto,
      image,
    );
  }
  //getting all recent Activities
  @Get('recentactivities')
  getAllRecentActivities() {
    return this.adminService.getAllRecentActivities();
  }
  @Delete('recentactivities/:id')
  deleteRecentActivity(@Param('id') id: string) {
    return this.adminService.deleteRecentActivity(id);
  }

  //ABOUTUS
  //adding AboutUs
  @Post('aboutus')
  @UseInterceptors(FileInterceptor('file'))
  addAboutUs(
    @GetUser() admin: Admin,
    @Body() aboutUsDto: AboutUsDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminService.addAboutUs(
      admin,
      aboutUsDto,
      image,
    );
  }
  //getting all AboutUs
  @Get('aboutus')
  getAllAboutUs() {
    return this.adminService.getAllAboutUs();
  }
  //deleting AboutUs
  @Delete('aboutus/:id')
  deleteAboutUs(@Param('id') id: string) {
    return this.adminService.deleteAboutUs(id);
  }

  //uploading data to aws-s3-bucket
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
    ]),
  )
  uploadtToS3(
    @UploadedFiles()
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
    },
  ) {
    if (!files.file1 || !files.file2) {
      throw new BadRequestException(
        'Please provide both files',
      );
    }

    // Note that file1 is an array, so we need to access the first element
    return this.adminService.uploadFile(files.file1[0]);
  }
}
