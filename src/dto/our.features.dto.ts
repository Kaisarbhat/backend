import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class OurFeaturesDto {
  file: Express.Multer.File;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
}
export class UpdateOurFeaturesDto {
  @IsOptional()
  file: Express.Multer.File;
  @IsString()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  description: string;
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
