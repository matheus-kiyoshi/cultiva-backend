import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
	Get,
  Request,
  UseGuards,
  Body
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LoginRequestBody } from './models/LoginRequestBody';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user and return access token' })
  async login(@Request() req: AuthRequest, @Body() loginRequestBody: LoginRequestBody) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user profile' })
  getProfile(@Request() req: AuthRequest) {
    return req.user;
  }
}