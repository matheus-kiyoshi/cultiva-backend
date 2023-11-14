import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { Product } from "../entities/product.entity";
import { Decimal, DecimalJsLike } from "@prisma/client/runtime/library";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto extends Product {
	@ApiProperty({
		description: 'Product name identifier',
		example: 'Rice',
		required: true,
		type: 'string'
	})
	@IsString()
	name: string;

	@ApiProperty({
		description: 'Product description',
		example: "As a cereal grain, domesticated rice is the most widely consumed staple food for over half of the world's  human population, particularly in Asia and Africa. It is the agricultural commodity with the third-highest worldwide production, after sugarcane and maize.",
		required: true,
		type: 'string'
	})
	@IsString()
	description: string;

	@ApiProperty({
		description: 'Product manufacturing date (ISO8601 format)',
		example: '2023-11-14T13:47:51.620Z',
		required: true,
		type: 'date'
	})
	@IsDateString()
	manufacturingDate: Date;

	@ApiProperty({
		description: 'Product expiration date (ISO8601 format)',
		example: '2023-11-14T13:47:51.620Z',
		required: true,
		type: 'date'
	})
	@IsDateString()
	expirationDate: Date;
	
	@ApiProperty({
		description: 'Product price',
		example: 10.00,
		required: true,
		type: 'number'
	})
	@IsNumber()
	price: string | number | Decimal | DecimalJsLike;
	
	@ApiProperty({
		description: 'Product quantity',
		example: 10,
		required: false,
		type: 'number'
	})
	@IsOptional()
	@IsNumber()
	quantity?: number | undefined;

	@ApiProperty({
		description: 'Product is sold out',
		example: false,
		required: false,
		type: 'boolean'
	})
	@IsOptional()
	@IsBoolean()
	soldOut?: boolean | undefined;

	@ApiProperty({
		description: 'Product category',
		example: 'fruits',
		required: true,
		type: 'string'
	})
	@IsString()
	category: string
}
