import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUrl,
  ValidateNested,
} from 'class-validator';

// Event DTOs
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  shortName: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  shortName: string;
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  location?: string;
}

export class EventResponseDto {
  id: string;
  name: string;
  shortName: string;
  imageUrl: string;
  description: string;
  date: string;
  location: string;
  eventData?: EventDataResponseDto;
}

// EventData DTOs
export class CreateEventDataDto {
  @IsUrl()
  @IsNotEmpty()
  raceImageUrl: string;

  @IsString()
  @IsOptional()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  details1: string;

  @IsString()
  @IsOptional()
  details2?: string;

  @IsString()
  @IsOptional()
  details3?: string;

  @IsString()
  @IsOptional()
  details4?: string;

  @IsString()
  @IsNotEmpty()
  direction1: string;

  @IsString()
  @IsOptional()
  direction2?: string;

  @IsString()
  @IsOptional()
  direction3?: string;

  @IsString()
  @IsOptional()
  direction4?: string;
}

export class UpdateEventDataDto {
  @IsString()
  @IsOptional()
  raceImageUrl?: string;

  @IsString()
  @IsOptional()
  details1?: string;

  @IsString()
  @IsOptional()
  details2?: string;

  @IsString()
  @IsOptional()
  details3?: string;

  @IsString()
  @IsOptional()
  details4?: string;

  @IsString()
  @IsOptional()
  direction1?: string;

  @IsString()
  @IsOptional()
  direction2?: string;

  @IsString()
  @IsOptional()
  direction3?: string;

  @IsString()
  @IsOptional()
  direction4?: string;
}

export class EventDataResponseDto {
  id: string;
  raceImageUrl: string;
  eventId: string;
  details1: string;
  details2?: string;
  details3?: string;
  details4?: string;
  direction1: string;
  direction2?: string;
  direction3?: string;
  direction4?: string;
}
export class EventResponseWithDataDto {
  event: EventResponseDto;
  eventData: EventDataResponseDto | null;
}

export class CreateEventWithDataDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEventDto)
  event: CreateEventDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEventDataDto)
  eventData: CreateEventDataDto;
}

export class UpdateEventWithDataDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEventDto)
  event: UpdateEventDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEventDataDto)
  eventData: UpdateEventDataDto;
}
