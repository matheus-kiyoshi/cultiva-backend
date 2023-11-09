import { Request, Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { UpdateUserPasswordDto } from './dto/update-user-password';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { RequestPasswordUserDto } from './dto/request-password-reset.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @IsPublic()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch()
  @HttpCode(200)
  update(@Request() req: AuthRequest, @Body() updateUserDto: UpdateUserDto) {
    if (req.user.id) {
      return this.userService.update(req.user.id, updateUserDto);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Delete()
  @HttpCode(200)
  remove(@Request() req: AuthRequest) {
    if (req.user.id) {
      return this.userService.remove(req.user.id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Patch('password')
  @HttpCode(200)
  updatePassword(
    @Request() req: AuthRequest, 
    @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    if (req.user.id) {
      return this.userService.updatePassword(req.user.id, updateUserPasswordDto);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @IsPublic()
  @Patch('password/requestreset')
  @HttpCode(200)
  requestPasswordRest(
    @Body() requestPasswordUserDto: RequestPasswordUserDto
  ) {
    return this.userService.requestPasswordReset(requestPasswordUserDto.email);
  }

  @IsPublic()
  @Patch('password/reset')
  @HttpCode(200)
  resetPassword(
    @Body() resetPasswordUserDto: ResetPasswordUserDto,
  ) {
    return this.userService.resetPassword(resetPasswordUserDto);
  }

  @IsPublic()
  @Get('search/:searchArg')
  findBySearchArg(@Param('searchArg') searchArg: string) {
    return this.userService.findBySearchArg(searchArg);
  }
}
