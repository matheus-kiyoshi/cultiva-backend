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

  async addFavorite(id: string, productId: string) {
    const client = await this.prisma.client.findUnique({ 
      where: { userId: id },
      include: {
        favorites: {
          where: { id: productId }
        }
      } 
    });
    if (!client) {
      throw new HttpException('User not found', 404);
    } else if (client.favorites.length > 0) {
      throw new HttpException('Product already added to favorites', 400);
    }

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    const updatedClient = await this.prisma.client.update({
      where: { userId: id },
      data: {
        favorites: {
          connect: {
            id: productId
          }
        }
      },
      include: {
        favorites: true
      }
    })
    if (!updatedClient) {
      throw new HttpException('Error adding product to favorites', 500);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        favorites: {
          connect: {
            userId: id
          }
        }
      }
    })
    if (!updatedProduct) {
      throw new HttpException('Error adding user to product favorites', 500);
    }

    return updatedClient
  }

  async addCart(id: string, productId: string) {
    const client = await this.prisma.client.findUnique({ 
      where: { userId: id },
      include: {
        cart: {
          where: { productId }
        }
      } 
    });
    if (!client) {
      throw new HttpException('User not found', 404);
    } else if (client.cart.length > 0) {
      throw new HttpException('Product already added to cart', 400);
    }

    const product = await this.prisma.product.findUnique({ 
      where: { id: productId },
      include: {
        cart: true
      }
    });
    if (!product) {
      throw new HttpException('Product not found', 404);
    } else if (product.cart.length === product.quantity) {
      throw new HttpException('Product out of stock', 400);
    }

    const cart = await this.prisma.cart.create({
      data: {
        client: {
          connect: {
            userId: id
          }
        },
        product: {
          connect: {
            id: productId
          }
        }
      }
    })
    if (!cart) {
      throw new HttpException('Error adding product to cart', 500);
    }

    return cart
  }

  async getCart(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { userId: id },
      include: {
        cart: true
      }
    })
    if (!client) {
      throw new HttpException('User not found', 404);
    } else if (client.cart.length === 0) {
      throw new HttpException('No products in cart', 404);
    }

    return client.cart
  }

  async removeCart(id: string, cartId: string) {
    const client = await this.prisma.client.findUnique({ where: { userId: id } })
    if (!client) {
      throw new HttpException('Client not found', 404);
    }

    try {
      const cart = await this.prisma.cart.delete({
        where: {
          cartId
        }
      })
    }
    catch (error) {
      throw new HttpException('Cart not found', 404);
    }

    return 'Product removed from cart'
  }
}
