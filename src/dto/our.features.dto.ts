import { OurFeatures } from './../../node_modules/.prisma/client/index.d';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class OurFeaturesDto {
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsOptional()
  createdBy: string;
  @IsDate()
  @IsOptional()
  createdAt: string;
}
export class UpdateOurFeaturesDto {
  @IsUrl()
  @IsOptional()
  imageUrl: string;
  @IsString()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsOptional()
  updatedBy: string;
  @IsDate()
  @IsOptional()
  updatedAt: Date;
}

export class OurFeaturesResponse {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
