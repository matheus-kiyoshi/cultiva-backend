import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
	constructor(private readonly prisma: PrismaService) {}

	async create(id: string, createOrderDto: CreateOrderDto) {
		const user = await this.prisma.user.findUnique({ where: { id } })
		if (!user) {
			throw new HttpException('User not found', 404)
		}

		const productsId = createOrderDto.products
		if (productsId.length === 0) {
			throw new HttpException('You need to but at least one product', 404)
		}

		await Promise.all(productsId.map(async (productId) => {
			const productExists = await this.prisma.product.findUnique({ where: { id: productId } })
			if (!productExists) {
				throw new HttpException('Product not found', 404)
			} else if (productExists.quantity < 1) {
				throw new HttpException('Product out of stock', 400)
			}
		}))

		const order = await this.prisma.order.create({
			data: {
				paymentMethod: createOrderDto.paymentMethod,
				value: createOrderDto.value,
			}
		})
		if (!order) {
			throw new HttpException('Error creating order', 401)
		}

		let buys: any = []
		let sales: any = []

		await Promise.all(productsId.map(async (productId) => {
			const product = await this.prisma.product.update({
				where: { id: productId },
				data: {
					quantity: {
						decrement: 1
					}
				}
			})
			if (!product) {
				throw new HttpException('Product not found', 404)
			}

			const buyData: Prisma.BuyCreateInput = {
				quantity: 1,
				client: {
					connect: {
						userId: id
					}
				},
				product: {
					connect: {
						id: product.id
					}
				},
				order: {
					connect: {
						id: order.id
					}
				}
			}

			const buy = await this.prisma.buy.create({ data: buyData })
			if (!buy) {
				throw new HttpException('Error creating buy', 401)
			}

			const saleData: Prisma.SaleCreateInput = {
				quantity: 1,
				product: {
					connect: {
						id: product.id
					}
				},
				producer: {
					connect: {
						userId: product.producerId
					}
				},
				order: {
					connect: {
						id: order.id
					}
				}
			}

			const sale = await this.prisma.sale.create({ data: saleData })
			if (!sale) {
				throw new HttpException('Error creating sale', 401)
			}

			buys.push(buy)
			sales.push(sale)
		}))

		const actualOrder = {
			...order,
			buy: buys,
			sale: sales
		}

		return actualOrder
	}

	async findOne(id: string) {
		const order = await this.prisma.order.findUnique({
			where: { id },
			include: {
				buy: true,
				sale: true
			}
		})
		if (!order) {
			throw new HttpException('Order not found', 404)
		}

		return order
	}
}
