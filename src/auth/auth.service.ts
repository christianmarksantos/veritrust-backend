import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 1. Check if email already exists -> throw 409 Conflict
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    // 2. Hash the plain-text password with 10 salt rounds
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    // 3. Create and save the user entity into MySQL (user_accounts)
    const newUser = this.usersRepository.create({
      fullName: registerDto.fullName,
      email: registerDto.email,
      passwordHash,
      role: registerDto.role ?? UserRole.BUYER,
    });
    const savedUser = await this.usersRepository.save(newUser);

    // 4. Strip passwordHash before returning the user profile
    const { passwordHash: _, ...userProfile } = savedUser;
    return userProfile;
  }

  async login(loginDto: LoginDto) {
    // 1. Look up the user by email
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // 2. Compare submitted password with stored bcrypt hash -> throw 401 if invalid
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // 3. Sign and return the JWT payload
    const payload = { sub: user.userId, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}