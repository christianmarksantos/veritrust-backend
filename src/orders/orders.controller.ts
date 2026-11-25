import { Controller, Get, Post, Patch, Param, Body, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.ordersService.findAllForUser(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.ordersService.findOne(id, req.user);
  }

  @Post()
  @Roles(UserRole.BUYER)
  create(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, createOrderDto);
  }

  @Patch(':id')
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Req() req: any, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateStatus(id, req.user, updateOrderDto);
  }
}