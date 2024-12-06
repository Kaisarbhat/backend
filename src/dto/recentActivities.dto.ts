

export class RecentActivitiesDto {
  file: Express.Multer.File;
}
export class RecentActivitiesDtoResponse {
  id: string;
  imageUrl: string;
  createdBy: string;
  createdAt: Date;
}
