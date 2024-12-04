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

  file1: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  date: string;
  @IsUrl()
  @IsNotEmpty()
  location: string;

  //image file
  file2: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  heading: string;

  // @IsArray()
  @IsNotEmpty()
  text: string[];
  //image file
  file3: Express.Multer.File;

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
  file?: Express.Multer.File;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsUrl()
  @IsOptional()
  location?: string;

  @IsUrl()
  @IsOptional()
  resultLink?: string;

  @IsOptional()
  //image file
  imageUrl?: Express.Multer.File;

  @IsString()
  @IsOptional()
  heading?: string;
  @IsArray()
  @IsOptional()
  text?: string[];

  //image file
  bottomImageUrl?: Express.Multer.File;

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
