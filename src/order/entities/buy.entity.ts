import { Prisma } from '@prisma/client';

export class Buy implements Prisma.BuyUncheckedCreateInput {
	id?: string
	productId: string
	clientId: string
	orderId: string
	quantity: number
}