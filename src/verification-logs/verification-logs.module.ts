import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationLogsService } from './verification-logs.service.js';
import { VerificationLogsController } from './verification-logs.controller.js';
import { VerificationLog } from './entities/verification-log.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationLog])],
  controllers: [VerificationLogsController],
  providers: [VerificationLogsService],
})
export class VerificationLogsModule {}