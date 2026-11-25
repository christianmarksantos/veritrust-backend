import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(page = 1, limit = 10) {
    const users = await this.usersRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    return users.map(({ passwordHash, ...rest }) => rest);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { userId: id } });
    if (!user) throw new NotFoundException(`No user exists with ID ${id}.`);
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { userId: id } });
    if (!user) throw new NotFoundException(`No user exists with ID ${id}.`);
    Object.assign(user, updateUserDto);
    const saved = await this.usersRepository.save(user);
    const { passwordHash, ...rest } = saved;
    return rest;
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { userId: id } });
    if (!user) throw new NotFoundException(`No user exists with ID ${id}.`);
    await this.usersRepository.remove(user);
  }
}