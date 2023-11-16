import { Request, Controller, Get, Post, Param, Delete, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { ClientService } from './client.service';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create client' })
  create(@Request() req: AuthRequest) {
    if (req.user.id) {
      return this.clientService.create(req.user.id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @IsPublic()
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all clients' })
  findAll() {
    return this.clientService.findAll();
  }

  @IsPublic()
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get client by id' })
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post(':id/favorite')
  @HttpCode(200)
  @ApiOperation({ summary: 'Add product to favorites' })
  addFavorite(
    @Request() req: AuthRequest,
    @Param('id') productId: string
  ) {
    if (req.user.id) {
      return this.clientService.addFavorite(req.user.id, productId);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Get('/my/favorites')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get favorites' })
  getFavorites(
    @Request() req: AuthRequest
  ) {
    if (req.user.id) {
      return this.clientService.getFavorites(req.user.id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id/favorite')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove product from favorites' })
  removeFavorite(
    @Request() req: AuthRequest,
    @Param('id') productId: string
  ) {
    if (req.user.id) {
      return this.clientService.removeFavorite(req.user.id, productId);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Post(':id/cart')
  @HttpCode(201)
  @ApiOperation({ summary: 'Add product to cart' })
  addCart(
    @Request() req: AuthRequest,
    @Param('id') productId: string
  ) {
    if (req.user.id) {
      return this.clientService.addCart(req.user.id, productId);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @IsPublic()
  @Get(':id/cart')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get cart' })
  getCart(
    @Param('id') id: string
  ) {
    return this.clientService.getCart(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id/cart')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove product from cart' })
  removeCart(
    @Request() req: AuthRequest,
    @Param('id') productId: string
  ) {
    if (req.user.id) {
      return this.clientService.removeCart(req.user.id, productId);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
