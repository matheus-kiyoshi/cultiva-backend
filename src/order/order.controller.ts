import { Controller, Post, HttpCode, HttpException, Request, Body, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create an order' })
  create(@Request() req: AuthRequest, @Body() createOrderDto: CreateOrderDto) {
    if (req.user.id) {
      return this.orderService.create(req.user.id, createOrderDto);
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get an order' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}
