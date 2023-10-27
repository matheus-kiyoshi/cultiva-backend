import { Prisma } from '@prisma/client';
import { User } from '../entities/user.entity';
import {
  IsEmail,
  IsMobilePhone,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto extends User {

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsMobilePhone()
  telephone: string;

  @IsOptional()
  @IsObject()
  address: Prisma.AddressUpsertWithoutUserInput;

}