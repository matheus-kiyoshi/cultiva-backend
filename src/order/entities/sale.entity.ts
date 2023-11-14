import { Prisma } from '@prisma/client';

export class Sale implements Prisma.SaleUncheckedCreateInput {
	id?: string
	productId: string
	producerId: string
	orderId: string
	quantity: number
}