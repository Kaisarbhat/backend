import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class EventRegistrationDto {
  @IsString()
  @IsOptional()
  eventId: string;
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
  @IsString()
  @IsNotEmpty()
  cardiovascularDisease: string;
  @IsString()
  @IsNotEmpty()
  medicalSupervision: string;
  @IsString()
  @IsNotEmpty()
  pregnancyRisk: string;
  @IsString()
  @IsNotEmpty()
  asthma: string;
  @IsString()
  @IsNotEmpty()
  dizziness: string;
  @IsString()
  @IsNotEmpty()
  chestPain: string;
  @IsString()
  @IsNotEmpty()
  chronicIllness: string;
  @IsOptional()
  @IsString()
  otherMedicalConditions?: string;
  @IsUrl()
  @IsNotEmpty()
  timingCertificates: string;
  @IsBoolean()
  @IsNotEmpty()
  waiverAcknowledgement: boolean;
  @IsBoolean()
  @IsOptional()
  joinClub: boolean;
  @IsString()
  @IsNotEmpty()
  paymentId: string;
}
