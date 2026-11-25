import { PartialType } from '@nestjs/mapped-types';
import { CreateVerificationLogDto } from './create-verification-log.dto.js';

export class UpdateVerificationLogDto extends PartialType(CreateVerificationLogDto) {}
