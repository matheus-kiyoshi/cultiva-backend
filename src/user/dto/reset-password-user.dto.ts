import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: '12345678-1234-1234-1234-123456789012',
    description: 'User id',
    required: true,
    type: 'string'
  })
  @IsString()
	id: string;

  @ApiProperty({
    example: '12345678passworD',
    description: 'New password',
    required: true,
    type: 'string'
  })
	@IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSIaIkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5a',
    description: 'Password reset token returned by email',
    required: true,
    type: 'string'
  })
	@IsString()
	token: string;
}