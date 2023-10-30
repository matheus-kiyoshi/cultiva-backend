import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail } from 'class-validator';

export class RequestPasswordUserDto extends PartialType(CreateUserDto) {
	@IsEmail()
	email: string;
}