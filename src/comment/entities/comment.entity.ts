import { Prisma } from "@prisma/client"

export class Comment implements Prisma.CommentUncheckedCreateInput {
	id?: string
	clientId: string
	content: string
	rating: number
	createdAt?: Date | string
	updatedAt?: Date | string
	userId?: string | null
	productId?: string | null
}