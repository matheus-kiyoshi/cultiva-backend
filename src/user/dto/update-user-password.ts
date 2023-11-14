import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The current password of the user',
    example: 'strongPassword123',
    required: true,
    type: 'string'
  })
	@IsString()
  @MinLength(4)
  @MaxLength(20)
  currentPassword: string;

  @ApiProperty({
    description: 'The new password of the user',
    example: 'StrongPassword123',
    required: true,
    type: 'string'
  })
	@IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'password too weak',
  })
  newPassword: string;
}