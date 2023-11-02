import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { Product } from "../entities/product.entity";
import { Decimal, DecimalJsLike } from "@prisma/client/runtime/library";

export class CreateProductDto extends Product {
	@IsString()
	name: string;

	@IsString()
	description: string;

	@IsDateString()
	manufacturingDate: Date;

	@IsDateString()
	expirationDate: Date;

	@IsNumber()
	price: string | number | Decimal | DecimalJsLike;

	@IsOptional()
	@IsNumber()
	quantity?: number | undefined;

	@IsOptional()
	@IsBoolean()
	soldOut?: boolean | undefined;
}
