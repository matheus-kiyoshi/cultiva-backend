import { Prisma } from "@prisma/client"
import { DecimalJsLike } from "@prisma/client/runtime/library"

export class Product implements Prisma.ProductUncheckedCreateInput {
	id?: string
	name: string
	description: string
	manufacturingDate: Date | string
	expirationDate: Date | string
	soldOut?: boolean
	quantity?: number
	price: Prisma.Decimal | DecimalJsLike | number | string
	rating?: Prisma.ProductCreateratingInput | number[]
	createdAt?: Date | string
	producerId: string
	buys?: Prisma.BuyUncheckedCreateNestedManyWithoutProductInput
	sales?: Prisma.SaleUncheckedCreateNestedManyWithoutProductInput
	comments?: Prisma.CommentUncheckedCreateNestedManyWithoutProductInput
	favorites?: Prisma.ClientUncheckedCreateNestedManyWithoutFavoritesInput
}