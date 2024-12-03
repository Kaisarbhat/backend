import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class EventRegistrationDto {
  @IsString()
  @IsOptional()
  eventIs: String;
  @IsString()
  @IsNotEmpty()
  runningCategory: string;
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsString()
  @IsNotEmpty()
  mobile: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  gender: string;
  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;
  @IsString()
  @IsNotEmpty()
  tShirtSize: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  state: string;
  @IsString()
  @IsNotEmpty()
  bloodGroup: string;
  @IsString()
  @IsNotEmpty()
  bibName: string;
  @IsString()
  @IsNotEmpty()
  runningClub: string;
  @IsString()
  @IsNotEmpty()
  emergencyContactName: string;
  @IsString()
  @IsNotEmpty()
  emergencyContactRelation: string;
  @IsString()
  @IsNotEmpty()
  emergencyContactNumber: string;
  @IsBoolean()
  @IsNotEmpty()
  cardiovascularDisease: boolean;
  @IsBoolean()
  @IsNotEmpty()
  medicalSupervision: boolean;
  @IsBoolean()
  @IsNotEmpty()
  pregnancyRisk: boolean;
  @IsBoolean()
  @IsNotEmpty()
  asthma: boolean;
  @IsBoolean()
  @IsNotEmpty()
  dizziness: boolean;
  @IsBoolean()
  @IsNotEmpty()
  chestPain: boolean;
  @IsBoolean()
  @IsNotEmpty()
  chronicIllness: boolean;
  @IsOptional()
  @IsString()
  otherMedicalConditions?: string;
  @IsOptional()
  @IsString()
  timingCertificates: string;
  @IsBoolean()
  @IsNotEmpty()
  waiverAcknowledgement: boolean;
  @IsBoolean()
  @IsNotEmpty()
  joinClub: boolean;
}
