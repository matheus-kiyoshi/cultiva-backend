import { HttpCode, Request, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { IsNotNullPipe } from './pipes/IsNotNullPipe';

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

  @Get()
  findAll() {
    return this.producerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.producerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProducerDto: UpdateProducerDto) {
    return this.producerService.update(+id, updateProducerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.producerService.remove(+id);
  }
}
