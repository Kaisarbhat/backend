import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUrl,
  IsArray,
} from 'class-validator';

// Event DTOs
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  shortName: string;

  bannerOne: Express.Multer.File;
  bannerTwo: Express.Multer.File;
  bannerThree: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  location: string;
  @IsUrl()
  @IsNotEmpty()
  locationUrl: string;

  //image file
  middleImage: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  heading: string;

  // @IsArray()
  @IsNotEmpty()
  text: string[];
  //image file
  bottomImage: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  bottomHeading: string;
  @IsString()
  @IsNotEmpty()
  bottomText: string;

  @IsString()
  @IsNotEmpty()
  warning: string;
}
export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  shortName?: string;

  @IsOptional()
  bannerOne?: Express.Multer.File;
  @IsOptional()
  bannerTwo?: Express.Multer.File;
  @IsOptional()
  bannerThree?: Express.Multer.File;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsUrl()
  @IsOptional()
  locationUrl: string;
  @IsUrl()
  @IsOptional()
  resultLink?: string;

  @IsOptional()
  //image file
  middleImage?: Express.Multer.File;

  @IsString()
  @IsOptional()
  heading?: string;
  @IsArray()
  @IsOptional()
  text?: string[];

  //image file
  bottomImage?: Express.Multer.File;

  @IsString()
  @IsOptional()
  bottomHeading?: string;
  @IsString()
  @IsOptional()
  bottomText?: string;

  @IsString()
  @IsOptional()
  warning?: string;
}
