import { Decimal, DecimalJsLike } from "@prisma/client/runtime/library";
import { Order } from "../entities/order.entity";
import { IsNotEmpty, IsString, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto extends Order {
	@ApiProperty({
		description: 'Payment method',
		example: 'Pix',
		required: true,
		type: String
	})
	@IsString()
	paymentMethod: string;

	@ApiProperty({
		description: 'Total value of the order',
		example: 10.00,
		required: true,
		type: Number
	})
	@IsNotEmpty()
	value: string | number | Decimal | DecimalJsLike;

	@ApiProperty({
		description: 'List of ids of products',
		example: ['853dadf7-b596-4b35-8a41-ed4653e8afdd', '174hawf8-a522-4a25-2b61-ed4424e8aeawd'],
		required: true,
		type: [String]
	})
	@IsNotEmpty()
	@IsArray()
	products: string[]
}