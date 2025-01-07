import { ConfigService } from '@nestjs/config';
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: S3;
  constructor(private readonly config: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.config.get('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get(
        'S3_SECRET_ACCESS_KEY',
      ),
    });
  }

  //AWS Details and connecting to s3 bucket
  AWS_S3_BUCKET = this.config.get('S3_BUCKET');
  async uploadFile(file: Express.Multer.File) {
    const { originalname } = file;
    const imagesTypes = [
      'image/png',
      'image/jpg',
      'image/jpeg',
    ];
    //handling only  image types for upload
    if (!imagesTypes.includes(file.mimetype)) {
      throw new ForbiddenException(
        'File should be an image',
      );
    }
    //handling size of images 10 Mb max
    if (file.size > 1800 * 1944) {
      throw new ForbiddenException(
        'Image size should be less than 5 Mb',
      );
    }
    return await this.upload_To_S3(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  //uploading data to aws-s3-bucket
  async upload_To_S3(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ContentDisposition: this.config.get(
        'CONTENT_DISPOSITION',
      ),
    };
    try {
      const s3Response = await this.s3
        .upload(params)
        .promise();
      return s3Response.Location;
    } catch (error) {
      throw error;
    }
  }
}
