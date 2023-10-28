import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserPasswordDto extends PartialType(CreateUserDto) {
	@IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'password too weak',
  })
  currentPassword: string;

	@IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'password too weak',
  })
  newPassword: string;
}