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
  //HERO IMAGE
  //add Hero Image
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('heroimage')
  addHeroImage(
    @GetUser() admin: Admin,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminService.addHeroImage(admin, image);
  }

  //update heroimage
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Put('heroimage')
  updateHeroImage(
    @GetUser() admin: Admin,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminService.updateHeroImage(admin, image);
  }
  //getHeroImage
  @Get('heroimage')
  getHeroImage() {
    return this.adminService.getHeroImage();
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
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminService.addRecentActivities(
      admin,
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

  //Mobile recent Activities
  @UseGuards(JwtGuard)
  @Post('recentactivitiesmobile')
  @UseInterceptors(FileInterceptor('file'))
  addRecentActivityMobile(
    @GetUser() admin: Admin,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminService.addRecentActivityMobile(
      admin,
      image,
    );
  }
  //all mobile recent activities
  @Get('recentactivitiesmobile')
  getAllRecentActivitiesMobile() {
    return this.adminService.getAllRecentActicitiesMobile();
  }

  @UseGuards(JwtGuard)
  @Delete('recentactivitiesmobile/:id')
  deleteRecentActivityMobile(@Param('id') id: string) {
    return this.adminService.deleteRecentActivityMobile(id);
  }

  //ABOUTUS
  //adding AboutUs
  @UseGuards(JwtGuard)
  @Post('aboutus')
  @UseInterceptors(FileInterceptor('file'))
  addAboutUs(
    @GetUser() admin: Admin,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminService.addAboutUs(admin, image);
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

  //ABOUT US HERO IMAGE
  //add Hero Image
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('aboutusheroimage')
  addAboutUsHeroImage(
    @GetUser() admin: Admin,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminService.addAboutUsHeroImage(
      admin,
      image,
    );
  }

  //update heroimage
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Put('aboutusheroimage')
  updateAboutUsHeroImage(
    @GetUser() admin: Admin,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminService.updateAboutUsHeroImage(
      admin,
      image,
    );
  }
  //getHeroImage
  @Get('aboutusheroimage')
  getHeroAboutUsImage() {
    return this.adminService.getAboutUsHeroImage();
  }
}
