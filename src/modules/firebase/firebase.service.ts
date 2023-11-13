import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FirebaseService {
	constructor(private readonly prisma: PrismaService) {}

	async addIconToUser(userId: string, iconUrl: string) {
		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (!user) {
			throw new HttpException('User not found', 404);
		}

		const updatedUser = await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				icon: iconUrl
			}
		});
		if (!updatedUser) {
			throw new HttpException('User not found', 404);
		}

		return updatedUser;
	}

	async addImagesToProducts(userId: string, productId: string, images: string[]) {
		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (!user) {
			throw new HttpException('User not found', 404);
		}

		const product = await this.prisma.product.findUnique({ where: { id: productId } })
		if (!product) {
			throw new HttpException('Product not found', 404);
		}

		if (product.producerId !== userId) {
			throw new HttpException('You are not the owner of this product', 404);
		}

		const updatedProduct = await this.prisma.product.update({
			where: {
				id: productId
			},
			data: {
				images: images
			}
		})
		if (!updatedProduct) {
			throw new HttpException('Product not found', 404);
		}

		return updatedProduct
	}
}
