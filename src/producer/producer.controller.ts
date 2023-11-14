import { HttpCode, Request, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { IsNotNullPipe } from './pipes/IsNotNullPipe';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Producer')
@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new producer' })
  create(
    @Request() req: AuthRequest,
    @Body( new IsNotNullPipe()) createProducerDto: CreateProducerDto
  ) {
    if (req.user.id) {
      return this.producerService.create(req.user.id, createProducerDto);
    } else {
      throw new Error('Unauthorized');
    }
  }

  @IsPublic()
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all producers' })
  findAll() {
    return this.producerService.findAll();
  }

  @IsPublic()
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a producer' })
  findOne(@Param('id') id: string) {
    return this.producerService.findOne(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch()
  @HttpCode(201)
  @ApiOperation({ summary: 'Update a producer' })
  update(
    @Request() req: AuthRequest,
    @Body( new IsNotNullPipe()) updateProducerDto: UpdateProducerDto
  ) {
    if (req.user.id) {
      return this.producerService.update(req.user.id, updateProducerDto);
    } else {
      throw new Error('Unauthorized');
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a producer' })
  remove(@Request() req: AuthRequest) {
    if (req.user.id) {
      return this.producerService.remove(req.user.id);
    } else {
      throw new Error('Unauthorized');
    }
  }

  @IsPublic()
  @Get(':id/products')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all products of a producer' })
  getProducts(@Param('id') id: string) {
    return this.producerService.getProducts(id);
  }
}
