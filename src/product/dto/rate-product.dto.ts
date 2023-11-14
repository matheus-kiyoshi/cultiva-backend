import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Max, Min } from "class-validator";

export class RateProductDto {
	@ApiProperty({
		name: 'rating',
		description: 'The rating you want to give to the product',
		required: true,
		example: 5,
		type: 'number'
	})
	@IsNumber()
	@Min(1)
	@Max(5)
	rating: number
}