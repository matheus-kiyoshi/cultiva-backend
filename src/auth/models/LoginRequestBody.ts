import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestBody {
  @ApiProperty({
    required: true,
    description: 'email',
    example: 'user@email.com',
    type: 'string',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'password',
    example: 'strongPassword123',
    type: 'string',
  })
  @IsString()
  password: string;
}