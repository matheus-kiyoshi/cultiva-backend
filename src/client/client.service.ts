import { Injectable, HttpException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  create(id: string) {
    const user = this.prisma.user.findUnique({ where: { id }});
    if (!user) {
      throw new HttpException("User not found", 404)
    }
    
    return this.prisma.client.create({
      data: {
        userId: id
      }
    })
  }

  async findAll() {
    const clients = await this.prisma.client.findMany();
    if (!clients) {
      throw new HttpException('Error finding clients', 500);
    }
    if (clients.length === 0) {
      throw new HttpException('No clients found', 404);
    }

    return clients
  }

  findOne(id: string) {
    const client = this.prisma.client.findUnique({ where: { userId: id }});
    if (!client) {
      throw new HttpException('Client not found', 404);
    }

    return client
  }
}
