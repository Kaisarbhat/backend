import { ConfigService } from '@nestjs/config';
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private AWS_S3_BUCKET: string;

  constructor(private readonly config: ConfigService) {
    const region = this.config.get('AWS_REGION');

    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.config.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get(
          'S3_SECRET_ACCESS_KEY',
        ),
      },
      region,
      endpoint: `https://s3.${region}.amazonaws.com`,
      forcePathStyle: false,
    });

    this.AWS_S3_BUCKET = this.config.get('S3_BUCKET');
  }

  async uploadFile(file: Express.Multer.File) {
    const { originalname } = file;
    const imagesTypes = [
      'image/png',
      'image/jpg',
      'image/jpeg',
    ];

    //handling only image types for upload
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

  async upload_To_S3(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ): Promise<string> {
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
      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);

      // Constructing the URL using the correct region
      return `${encodeURIComponent(name)}`;
    } catch (error) {
      throw error;
    }
  }
}
