import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordUserDto extends PartialType(CreateUserDto) {
	@ApiProperty({
		example: 'user@email.com',
    description: `The email will be used to find the user and send a password reset link via email.`,
    type: 'string'
	})
	@IsEmail()
	email: string;
}