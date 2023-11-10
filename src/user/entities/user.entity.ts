import { Prisma } from "@prisma/client";
import { DecimalJsLike } from "@prisma/client/runtime/library";

export class User implements Prisma.UserUncheckedCreateInput {
	id?: string
	name: string
	email: string
	password: string
	token?: string | null
	telephone?: string | null
	addressId?: string | null
	rating?: Prisma.UserCreateratingInput | number[]
	createdAt?: Date | string
	producer?: Prisma.ProducerUncheckedCreateNestedOneWithoutUserInput
	client?: Prisma.ClientUncheckedCreateNestedOneWithoutUserInput
	comments?: Prisma.CommentUncheckedCreateNestedManyWithoutUserInput
}

export class Address implements Prisma.AddressUncheckedCreateInput {
	id?: string
	street: string
	number: number
	district: string
	complement: string
	cep: string
	city: string
	state: string
	userId?: string | null
}

export class Sale implements Prisma.SaleUncheckedCreateInput {
	id?: string
	productId: string
	producerId: string
	orderId: string
	quantity: number
}

export class Buy implements Prisma.BuyUncheckedCreateInput {
	id?: string
	productId: string
	clientId: string
	orderId: string
	quantity: number
}

export class Order implements Prisma.OrderUncheckedCreateInput {
	id?: string
	value: Prisma.Decimal | DecimalJsLike | number | string
	paymentMethod: string
	createdAt?: Date | string
	buy?: Prisma.BuyCreateNestedManyWithoutOrderInput
	sale?: Prisma.SaleCreateNestedManyWithoutOrderInput
}
