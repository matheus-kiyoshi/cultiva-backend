import { HttpCode, Request, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { IsNotNullPipe } from './pipes/IsNotNullPipe';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  @HttpCode(200)
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
  findAll() {
    return this.producerService.findAll();
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.producerService.findOne(id);
  }

  @Patch()
  @HttpCode(201)
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

  @Delete()
  remove(@Request() req: AuthRequest) {
    if (req.user.id) {
      return this.producerService.remove(req.user.id);
    } else {
      throw new Error('Unauthorized');
    }
  }
}
