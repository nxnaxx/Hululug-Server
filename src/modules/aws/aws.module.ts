import { Module } from '@nestjs/common';
import { AWSService } from './aws.service';
import { CustomConfigModule } from '@config/config.module';

@Module({
  imports: [CustomConfigModule],
  providers: [AWSService],
  exports: [AWSService],
})
export class AWSModule {}
