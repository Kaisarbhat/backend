import {
  OurFeaturesDto,
  UpdateOurFeaturesDto,
} from './../dto/our.features.dto';
import { JwtGuard } from 'src/auth/auth.guard';
import { AdminService } from './admin.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/get-user';
import { Admin } from '@prisma/client';
import { RecentActivitiesDto } from 'src/dto/recentActivities.dto';
import { AboutUsDto } from 'src/dto/aboutUs.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('adminservices')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //getting all the club members
  @UseGuards(JwtGuard)
  @Get('allusers')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  //handler for adding Our Features
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
  @Delete('ourfeatures/:id')
  deleteFeature(@Param('id') id: string) {
    return this.adminService.deleteFeature(id);
  }

  //adding recent activities
  @UseGuards(JwtGuard)
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
  //deleting recent activities
  @UseGuards(JwtGuard)
  @Delete('recentactivities/:id')
  deleteRecentActivity(@Param('id') id: string) {
    return this.adminService.deleteRecentActivity(id);
  }

  //ABOUTUS
  //adding AboutUs
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
  @Delete('aboutus/:id')
  deleteAboutUs(@Param('id') id: string) {
    return this.adminService.deleteAboutUs(id);
  }
}
