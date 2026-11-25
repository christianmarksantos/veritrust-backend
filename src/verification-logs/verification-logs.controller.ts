import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { VerificationLogsService } from './verification-logs.service.js';
import { FlagStatus } from './entities/verification-log.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';

@Controller('verification-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class VerificationLogsController {
  constructor(private readonly logsService: VerificationLogsService) {}

  @Get()
  findAll(@Query('flagStatus') flagStatus?: FlagStatus) {
    return this.logsService.findAll(flagStatus);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logsService.findOne(id);
  }
}