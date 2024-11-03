import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { generateFileHash } from 'src/utils';

@Injectable()
export class AWSService {
  s3Client: S3Client;
  awsRegion = this.configService.get<string>('awsRegion');
  awsS3BucketName = this.configService.get<string>('awsS3BucketName');

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('awsResion'),
      credentials: {
        accessKeyId: this.configService.get<string>('awsS3AccessKey'),
        secretAccessKey: this.configService.get<string>('awsS3SecretKey'),
      },
    });
  }

  async uploadImgToS3(file: Express.Multer.File, folder: string) {
    const fileName = generateFileHash(file.buffer);
    const ext = file.originalname.split('.').pop().toLowerCase();
    const allowedExtensions = ['png', 'jpg', 'jpeg'];

    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        '잘못된 파일 형식입니다. PNG, JPG, JPEG만 허용됩니다.',
      );
    }

    const uploadParams = new PutObjectCommand({
      Bucket: this.configService.get<string>('awsS3BucketName'),
      Key: `${folder}/${fileName}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });

    await this.s3Client.send(uploadParams);

    return `https://${this.awsS3BucketName}.s3.${this.awsRegion}.amazonaws.com/${folder}/${fileName}`;
  }

  async uploadImgToS3_2(file: Express.Multer.File) {
    const fileName = generateFileHash(file.buffer);
    const ext = file.originalname.split('.').pop().toLowerCase();
    const allowedExtensions = ['png', 'jpg', 'jpeg'];

    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        '잘못된 파일 형식입니다. PNG, JPG, JPEG만 허용됩니다.',
      );
    }

    const uploadParams = new PutObjectCommand({
      Bucket: this.configService.get<string>('awsS3BucketName'),
      Key: `ramens/${fileName}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });

    await this.s3Client.send(uploadParams);

    return `https://${this.awsS3BucketName}.s3.${this.awsRegion}.amazonaws.com/ramens/${fileName}`;
  }

  getS3Url(fileName: string, folder: string): string {
    return `https://${this.awsS3BucketName}.s3.${this.awsRegion}.amazonaws.com/${folder}/${fileName}`;
  }

  async deleteFileFromS3(fileName: string, folder: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.awsS3BucketName,
      Key: `${folder}/${fileName}`,
    });

    try {
      const data = await this.s3Client.send(command);
      console.log(`${this.awsS3BucketName}에서 ${fileName} 삭제 성공`);
      return data;
    } catch (error) {
      console.error(
        `${this.awsS3BucketName}에서 ${fileName} 삭제 실패:`,
        error,
      );
      throw error;
    }
  }
}
