import { Request, Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { UpdateUserPasswordDto } from './dto/update-user-password';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { RequestPasswordUserDto } from './dto/request-password-reset.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @IsPublic()
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.userService.findAll();
  }

  @IsPublic()
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch()
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user informations' })
  update(@Request() req: AuthRequest, @Body() updateUserDto: UpdateUserDto) {
    if (req.user.id) {
      return this.userService.update(req.user.id, updateUserDto);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Delete()
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete user' })
  remove(@Request() req: AuthRequest) {
    if (req.user.id) {
      return this.userService.remove(req.user.id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Patch('password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user password' })
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
  @ApiOperation({ summary: 'Request password reset link via email' })
  requestPasswordRest(
    @Body() requestPasswordUserDto: RequestPasswordUserDto
  ) {
    return this.userService.requestPasswordReset(requestPasswordUserDto.email);
  }

  @IsPublic()
  @Patch('password/reset')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset user password' })
  resetPassword(
    @Body() resetPasswordUserDto: ResetPasswordUserDto,
  ) {
    return this.userService.resetPassword(resetPasswordUserDto);
  }

  @IsPublic()
  @Get(':id/orders')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user orders' })
  getUserOrders(
    @Param('id') id: string
  ) {
    return this.userService.getUserOrders(id);
  }

  @IsPublic()
  @Get(':id/buys')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user orders' })
  getUserBuys(
    @Param('id') id: string
  ) {
    return this.userService.getUserBuys(id);
  }

  @IsPublic()
  @Get(':id/sales')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user orders' })
  getUserSales(
    @Param('id') id: string
  ) {
    return this.userService.getUserSales(id);
  }

  @IsPublic()
  @Get('search/:searchArg')
  @ApiOperation({ summary: 'Search users by name or email' })
  findBySearchArg(@Param('searchArg') searchArg: string) {
    return this.userService.findBySearchArg(searchArg);
  }
}
