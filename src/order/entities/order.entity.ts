import { Prisma } from '@prisma/client';
import { DecimalJsLike } from '@prisma/client/runtime/library';

export class Order implements Prisma.OrderUncheckedCreateInput {
	id?: string
	value: Prisma.Decimal | DecimalJsLike | number | string
	paymentMethod: string
	createdAt?: Date | string
	buy?: Prisma.BuyCreateNestedManyWithoutOrderInput
	sale?: Prisma.SaleCreateNestedManyWithoutOrderInput
}