type create<T> = {}

export class User {
	id?: string;
	name: string;
	email: string;
	password?: string;
	telephone?: string | null;
	address?: create<Address>;
	rating: number[];
	createdAt: Date;
	producer?: create<Producer>;
	client?: create<Client>;
	comments?: create<Comment[]>;
}

export class EditableUserInformations {
	name: string;
	email: string;
	telephone: String;
	address: create<Address>;
}

export class Producer extends User {
	user: User;
	products: Product[];
	cpf?: string;
	cnpj?: string;
	sales: Sale[];
}

export class Client extends User {
	user: User;
	favorites: Product[];
	purchases: Buy[];
	commentsOnProducts: Comment[];
}

export class Address {
	id: string;
	street: string;
	number: number;
	district: string;
	complement: string;
	cep: string;
	city: string;
	state: string;
}

export class Comment {
	id: string;
	client: Client;
	content: string;
	rating: number;
	createdAt: Date;
	updatedAt: Date;
	user: User;
	product: Product;
}

export class Sale {
	id: string;
	product: Product;
	producer: Producer;
	order: Order;
	quantity: number;
}

export class Buy {
	id: string;
	product: Product;
	client: Client;
	order: Order;
	quantity: number;
}

export class Product {
	id: string;
	name: string;
	description: string;
	manufacturingDate: Date;
	expirationDate: Date;
	soldOut: boolean;
	quantity: number;
	price: number;
	rating: number[];
	createdAt: Date;
	producer: Producer;
	buys: Buy[];
	sales: Sale[];
	comments: Comment[];
	favorites: Client[];
}

export class Order {
	id: string;
	value: number;
	paymentMethod: string;
	createdAt: Date;
	buy: Buy[];
	sale: Sale[];
}
