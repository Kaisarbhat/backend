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
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/get-user';
import { Admin } from '@prisma/client';
import { RecentActivitiesDto } from 'src/dto/recentActivities.dto';
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
  addFeatures(
    @GetUser() admin: Admin,
    @Body() ourFeaturesDto: OurFeaturesDto,
  ) {
    return this.adminService.addOurFeatures(
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
  updateOurFeature(
    @GetUser() admin: Admin,
    @Param('id') id: string,
    @Body() updateOurFeaturesDto: UpdateOurFeaturesDto,
  ) {
    return this.adminService.updateOurFeature(
      admin,
      id,
      updateOurFeaturesDto,
    );
  }

  //delete feature
  @Delete('ourfeatures/:id')
  deleteFeature(@Param('id') id: string) {
    return this.adminService.deleteFeature(id);
  }

  //adding recent activities
  @Post('recentactivities')
  addrecentActivity(
    @GetUser() admin: Admin,
    @Body() recentActivitiesDto: RecentActivitiesDto,
  ) {
    return this.adminService.addRecentActivities(
      admin,
      recentActivitiesDto,
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
}
