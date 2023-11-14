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
  
    const today = new Date();
    const exp = new Date(createProductDto.expirationDate);
    const man = new Date(createProductDto.manufacturingDate);

    if (today > exp) {
      throw new HttpException('Expiration date must be greater than today', 400);
    } else if (today < man) {
      throw new HttpException('Manufacturing date must be less than today', 400);
    } else if (exp < man) {
      throw new HttpException('Expiration date must be greater than manufacturing date', 400);
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
    const products = await this.prisma.product.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: {
        comments: true
      }
    });
    if (!products) {
      throw new HttpException('Error finding products', 500);
    }
    if (products.length === 0) {
      throw new HttpException('No products found', 404);
    }

    return products;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ 
      where: { id },
      include: {
        comments: true
      }
    });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return product;
  }

  async findAllProductComments(productId: string, skip?: number) {
    const product = await this.prisma.product.findUnique({ where: { id: productId }});
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    const comments = await this.prisma.comment.findMany({
      where: { productId },
      skip: skip || 0,
      orderBy: {
        createdAt: 'desc'
      }
    });
    if (!comments) {
      throw new HttpException('No comments found', 404);
    }

    return comments
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

  async rate(id: string, productId: string, rating: number) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: {
          push: rating
        }
      }
    })

    if (!updatedProduct) {
      throw new HttpException('Error rating product', 500);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        rating: {
          push: rating
        }
      },
    })

    if (!updatedUser) {
      throw new HttpException('Error rating user', 500);
    }

    return {
      ...updatedUser,
      password: undefined,
    }
  }

  async findBySearch(search: string) {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search
            }
          },
          {
            description: {
              contains: search
            }
          }
        ]
      }
    });

    if (!products) {
      throw new HttpException('Error finding products', 500);
    } else if (products.length === 0) {
      throw new HttpException('No products found', 404);
    }

    return products
  }
}
