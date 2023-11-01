import { HttpException, Injectable } from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@Injectable()
export class ProducerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(id: string, createProducerDto: CreateProducerDto) {
    const producer = await this.prisma.producer.findUnique({ where: { userId: id }})
    if (producer) {
      throw new HttpException("Producer already exists", 400)
    }

    if (createProducerDto.cpf) {
      const isValidCpf = cpf.isValid(createProducerDto.cpf);
      if (!isValidCpf) {
        throw new HttpException("Invalid CPF", 400)
      }

      const prodCpf = cpf.format(createProducerDto.cpf)
      createProducerDto.cpf = prodCpf
    }

    if (createProducerDto.cnpj) {
      const isValidCnpj = cnpj.isValid(createProducerDto.cnpj);
      if (!isValidCnpj) {
        throw new HttpException("Invalid CNPJ", 400)
      }
      
      const prodCnpj = cnpj.format(createProducerDto.cnpj)
      createProducerDto.cnpj = prodCnpj
    }

    const data: Prisma.ProducerCreateInput = {
      ...createProducerDto,
      user: {
        connect: {
          id
        }
      }
    }

    try {
      const createdProducer = await this.prisma.producer.create({ data });
  
      return {
        ...createdProducer
      }
    } catch (err) {
      throw new HttpException('Error creating producer', 500);
    }
  }

  async findAll() {
    const producers = await this.prisma.producer.findMany();
    if (!producers) {
      throw new HttpException('Error finding producers', 500);
    } else if (producers.length === 0) {
      throw new HttpException('No producers found', 404);
    }

    return producers
  }

  async findOne(id: string) {
    const producer = await this.prisma.producer.findUnique({ where: { userId: id }})
    if (!producer) {
      throw new HttpException('Producer not found', 404);
    }

    return producer
  }

  async update(id: string, updateProducerDto: UpdateProducerDto) {
    if (updateProducerDto.cpf) {
      const isValidCpf = cpf.isValid(updateProducerDto.cpf);
      if (!isValidCpf) {
        throw new HttpException("Invalid CPF", 400)
      }

      const prodCpf = cpf.format(updateProducerDto.cpf)
      updateProducerDto.cpf = prodCpf
    }

    if (updateProducerDto.cnpj) {
      const isValidCnpj = cnpj.isValid(updateProducerDto.cnpj);
      if (!isValidCnpj) {
        throw new HttpException("Invalid CNPJ", 400)
      }
      
      const prodCnpj = cnpj.format(updateProducerDto.cnpj)
      updateProducerDto.cnpj = prodCnpj
    }

    const updatedProducer = await this.prisma.producer.update({
      where: { userId: id },
      data: {
        ...updateProducerDto
      },
    })

    if (!updatedProducer) {
      throw new HttpException('Error updating user', 500);
    }

    return {
      ...updatedProducer
    };
  }

  remove(id: string) {
    const deletedProducer = this.prisma.producer.delete({
      where: { userId: id },
    })
    if (!deletedProducer) {
      throw new HttpException('Error deleting producer', 500);
    }

    return {
      ...deletedProducer
    }
  }
}
