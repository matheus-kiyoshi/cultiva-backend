import { Injectable, HttpException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(id: string, createProductDto: CreateProductDto) {
    const producer = await this.prisma.producer.findUnique({ where: { userId: id }})
    if (!producer) {
      throw new HttpException("User not found", 404)
    }

    const data: Prisma.ProductCreateInput = {
      ...createProductDto,
      producer: {
        connectOrCreate: {
          create: {
            userId: id,
            cpf: producer?.cpf ? producer.cpf : '',
            cnpj: producer?.cnpj ? producer.cnpj : '',
          },
          where: {
            userId: id
          }
        }
      }
    }

    const createdProduct = await this.prisma.product.create({ data, include: { producer: true } });
    if (!createdProduct) {
      throw new HttpException('Error creating product', 500);
    }

    return {
      ...createdProduct,
      producer: {
        ...createdProduct.producer,
        password: undefined
      }
    }
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    if (!products) {
      throw new HttpException('Error finding products', 500);
    }
    if (products.length === 0) {
      throw new HttpException('No products found', 404);
    }

    return products;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return product;
  }

  async update(id: string, producerId: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id }});
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    if (product.producerId !== producerId) {
      throw new HttpException('Unauthorized', 401);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto
      }
    })

    if (!updatedProduct) {
      throw new HttpException('Error updating product', 500);
    }

    return {
      ...updatedProduct
    }
  }

  async remove(id: string, producerId: string) {
    const product = await this.prisma.product.findUnique({ where: { id }});
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    if (product.producerId !== producerId) {
      throw new HttpException('Unauthorized', 401);
    }

    const deletedProduct = await this.prisma.product.delete({ where: { id } })

    if (!deletedProduct) {
      throw new HttpException('Error deleting product', 500);
    }

    return {
      ...deletedProduct
    }
  }
}