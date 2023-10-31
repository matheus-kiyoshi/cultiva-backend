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

  findAll() {
    return `This action returns all producer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} producer`;
  }

  update(id: number, updateProducerDto: UpdateProducerDto) {
    return `This action updates a #${id} producer`;
  }

  remove(id: number) {
    return `This action removes a #${id} producer`;
  }
}
