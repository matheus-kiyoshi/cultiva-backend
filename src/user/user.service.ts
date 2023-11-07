import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { UpdateUserPasswordDto } from './dto/update-user-password';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { sendEmail } from 'src/utils/email/sendEmail.util';
import { prismaExclude } from 'src/utils/exclude/exclude-entity-attribute.util';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({ where: { email: createUserDto.email } });
    if (user) {
      throw new HttpException('User already exists', 400);
    }
    
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
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, 
      select: prismaExclude('User', ['password']),
    });
    if (!users) {
      throw new HttpException('Error finding users', 500);
    } else if (users.length === 0) {
      throw new HttpException('No users found', 404);
    }

    return users;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      select: prismaExclude('User', ['password']),
    });
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

  async updatePassword(id: string, updateUserPasswordDto: UpdateUserPasswordDto) {
    if (updateUserPasswordDto.currentPassword === updateUserPasswordDto.newPassword) {
      throw new HttpException('New password cannot be the same as the current password', 400);
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(updateUserPasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid current password', 401);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: await bcrypt.hash(updateUserPasswordDto.newPassword, 10),
      },
    })

    if (!updatedUser) {
      throw new HttpException('Error updating password', 500);
    }

    return {
      ...updatedUser,
      password: undefined,
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        token: hash,
      },
    })

    const link = `cultiva.com/passwordReset?token=${resetToken}&id=${user.id}`;
    
    sendEmail(
      user.email, 
      "Password Reset Request", 
      "Password Reset Request", 
      `<p>Please click the link below to reset your password:</p><a>${link}</a>`
    );

    return link;
  }

  async resetPassword(resetPasswordUserDto: ResetPasswordUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: resetPasswordUserDto.id } });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const userToken = user.token
    if (!userToken) {
      throw new Error("Invalid or expired password reset token");
    }

    const isValid = await bcrypt.compare(resetPasswordUserDto.token, userToken);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(resetPasswordUserDto.password, 10),
      },
    })

    if (!updatedUser) {
      throw new HttpException('Error updating password', 500);
    }

    sendEmail(
      user.email,
      'Password Reset Successfully',
      'Password Reset Successfully',
      '<p>Your password has been reset successfully.</p>'
    )

    return {
      ...updatedUser,
      password: undefined,
    }
  }
}
