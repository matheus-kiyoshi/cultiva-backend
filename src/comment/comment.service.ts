import { HttpException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clientId: string, productId: string, createCommentDto: CreateCommentDto) {
    const client = await this.prisma.client.findUnique({
      where: { userId: clientId },
    });
    if (!client) {
      throw new HttpException('Client not found', 404);
    }
    console.log(client)

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        producer: true
      }
    })
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    const data: Prisma.CommentCreateInput = {
      content: createCommentDto.content,
      rating: createCommentDto.rating,
      client: {
        connect: {
          userId: clientId
        }
      },
      product: {
        connect: {
          id: productId
        }
      }
    }

    const comment = await this.prisma.comment.create({ data })
    if (!comment) {
      throw new HttpException('Error creating comment', 500);
    }

    return comment
  }

  async findAll() {
    const comments = await this.prisma.comment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    if (!comments) {
      throw new HttpException('No comments found', 404);
    }

    return comments
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id }
    });
    if (!comment) {
      throw new HttpException('Comment not found', 404);
    }

    return comment
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
