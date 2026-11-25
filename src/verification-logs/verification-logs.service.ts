import { Injectable } from '@nestjs/common';
import { CreateVerificationLogDto } from './dto/create-verification-log.dto.js';
import { UpdateVerificationLogDto } from './dto/update-verification-log.dto.js';

@Injectable()
export class VerificationLogsService {
  create(createVerificationLogDto: CreateVerificationLogDto) {
    return 'This action adds a new verificationLog';
  }

  findAll() {
    return `This action returns all verificationLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} verificationLog`;
  }

  update(id: number, updateVerificationLogDto: UpdateVerificationLogDto) {
    return `This action updates a #${id} verificationLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} verificationLog`;
  }
}
