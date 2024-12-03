import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class RecentActivitiesDto {
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;
  @IsString()
  @IsOptional()
  createdBy: string;
  @IsDate()
  @IsOptional()
  createdAt: Date;
}

export class UpdateRecentActivitiesDto {
  @IsUrl()
  @IsOptional()
  imageUrl: string;
  @IsString()
  @IsOptional()
  updatedBy: string;
  @IsDate()
  @IsOptional()
  updatedAt: Date;
}

export class RecentActivitiesResponse {
  id: string;
  imageUrl: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
