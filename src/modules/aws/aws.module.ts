import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { CustomConfigModule } from '@config/config.module';

@Module({
  imports: [CustomConfigModule],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
