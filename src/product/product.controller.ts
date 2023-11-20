import { HttpException, HttpCode, HttpStatus, Controller, Request, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RateProductDto } from './dto/rate-product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create product' })
  create(@Request() req: AuthRequest, @Body() createProductDto: CreateProductDto) {
    if (req.user.id) {
      return this.productService.create(req.user.id, createProductDto);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @IsPublic()
  @Get()
  @ApiOperation({ summary: 'Find all products' })
  findAll() {
    return this.productService.findAll();
  }

  @IsPublic()
  @Get(':id')
  @ApiOperation({ summary: 'Find one product' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @IsPublic()
  @Get(':id/comments?')
  @ApiOperation({ summary: 'Find all product comments' })
  findAllProductComments(@Param('id') id: string, @Query('skip') skip: number) {
    return this.productService.findAllProductComments(id, skip);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  update(@Param('id') id: string, @Request() req: AuthRequest, @Body() updateProductDto: UpdateProductDto) {
    if (req.user.id) {
      return this.productService.update(id, req.user.id, updateProductDto);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    if (req.user.id) {
      return this.productService.remove(id, req.user.id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Post(':id/rate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Rate product' })
  rate(@Request() req: AuthRequest, @Param('id') id: string, @Body() rateProductDto: RateProductDto) {
    if (req.user.id) {
      return this.productService.rate(req.user.id, id, rateProductDto.rating);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @IsPublic()
  @Get(':id/buys')
  @ApiOperation({ summary: 'Get buys of product' })
  getBuys(@Param('id') id: string) {
    return this.productService.getBuys(id);
  }

  @IsPublic()
  @Get('search/:arg') 
  @ApiOperation({ summary: 'Find products by search' })
  findBySearch(@Param('arg') arg: string) {
    return this.productService.findBySearch(arg);
  }
}
