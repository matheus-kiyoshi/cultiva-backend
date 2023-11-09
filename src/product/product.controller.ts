import { HttpException, HttpCode, HttpStatus, Controller, Request, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { rate } from './types/rate';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(201)
  create(@Request() req: AuthRequest, @Body() createProductDto: CreateProductDto) {
    if (req.user.id) {
      return this.productService.create(req.user.id, createProductDto);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req: AuthRequest, @Body() updateProductDto: UpdateProductDto) {
    if (req.user.id) {
      return this.productService.update(id, req.user.id, updateProductDto);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    if (req.user.id) {
      return this.productService.remove(id, req.user.id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post(':id/rate')
  @HttpCode(200)
  rate(@Request() req: AuthRequest, @Param('id') id: string, @Body() rating: rate) {
    if (req.user.id) {
      return this.productService.rate(req.user.id, id, rating.rating);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @IsPublic()
  @Get('search/:arg') 
  findBySearch(@Param('arg') arg: string) {
    return this.productService.findBySearch(arg);
  }
}
