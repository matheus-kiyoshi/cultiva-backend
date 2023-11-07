import { Prisma } from "@prisma/client"

export class Client implements Prisma.ClientUncheckedCreateInput {
	userId: string
	cart?: Prisma.CartUncheckedCreateNestedManyWithoutClientInput
	favorites?: Prisma.ProductUncheckedCreateNestedManyWithoutFavoritesInput
	purchases?: Prisma.BuyUncheckedCreateNestedManyWithoutClientInput
	commentsOnProducts?: Prisma.CommentUncheckedCreateNestedManyWithoutClientInput
}
