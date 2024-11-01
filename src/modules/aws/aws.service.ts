import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { getUUID } from 'src/utils';

@Injectable()
export class AWSService {
  s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('awsResion'),
      credentials: {
        accessKeyId: this.configService.get<string>('awsS3AccessKey'),
        secretAccessKey: this.configService.get<string>('awsS3SecretKey'),
      },
    });
  }

  async uploadImgToS3(file: Express.Multer.File) {
    const awsRegion = this.configService.get<string>('awsRegion');
    const awsS3BucketName = this.configService.get<string>('awsS3BucketName');
    const fileName = getUUID();
    const ext = file.originalname.split('.').pop().toLowerCase();
    const allowedExtensions = ['png', 'jpg', 'jpeg'];

    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        '잘못된 파일 형식입니다. PNG, JPG, JPEG만 허용됩니다.',
      );
    }

    const uploadParams = new PutObjectCommand({
      Bucket: this.configService.get<string>('awsS3BucketName'),
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });

    await this.s3Client.send(uploadParams);

    return `https://${awsS3BucketName}.s3.${awsRegion}.amazonaws.com/${fileName}`;
  }
}
