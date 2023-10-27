import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsObject, IsOptional } from 'class-validator';
import { Address, Prisma } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

