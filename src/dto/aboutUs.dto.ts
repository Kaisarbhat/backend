export class AboutUsDto {
  file: Express.Multer.File;
}

export class AboutUsDtoResponse {
  id: string;
  imageUrl: string;
  createdBy: string;
  createdAt: Date;
}
