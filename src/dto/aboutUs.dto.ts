import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class AboutUsDto {
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

export class AboutUsDtoResponse {
  id: string;
  imageUrl: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
