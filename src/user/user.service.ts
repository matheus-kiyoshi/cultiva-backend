import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Address, User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    }

    const createdUser = await this.prisma.user.create({ data });

    if (!createdUser) {
      throw new HttpException('Error creating user', 500);
    }

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    if (!users) {
      throw new HttpException('Error finding users', 500);
    }

    return users;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
      include: {
        address: true
      }
    })

    if (!updatedUser) {
      throw new HttpException('Error updating user', 500);
    }

    return {
      ...updatedUser,
      password: undefined,
    };
  }

  async remove(id: string) {
    const deletedUser = await this.prisma.user.delete({ where: { id } });
    if (!deletedUser) {
      throw new HttpException('Error deleting user', 500);
    }
    
    return "User deleted";
  }
}
