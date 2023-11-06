import { Request, Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @HttpCode(201)
  create(@Request() req: AuthRequest) {
    if (req.user.id) {
      return this.clientService.create(req.user.id);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }
}
