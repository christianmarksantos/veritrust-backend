import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationLog, FlagStatus } from './entities/verification-log.entity.js';

@Injectable()
export class VerificationLogsService {
  constructor(
    @InjectRepository(VerificationLog)
    private readonly logsRepository: Repository<VerificationLog>,
  ) {}

  findAll(flagStatus?: FlagStatus) {
    if (flagStatus) {
      return this.logsRepository.find({ where: { flagStatus }, relations: { review: true } });
    }
    return this.logsRepository.find({ relations: { review: true } });
  }

  async findOne(id: number) {
    const log = await this.logsRepository.findOne({
      where: { logId: id },
      relations: { review: true },
    });
    if (!log) throw new NotFoundException(`No verification log exists with ID ${id}.`);
    return log;
  }
}