import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { UpdateUserPasswordDto } from './dto/update-user-password';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import * as nodemailer from 'nodemailer';

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>;

export function prismaExclude<T extends Entity, K extends Keys<T>>(
  type: T,
  omit: K[],
) {
  type Key = Exclude<Keys<T>, K>;
  type TMap = Record<Key, true>;
  const result: TMap = {} as TMap;
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true;
    }
  }
  return result;
}


export async function sendEmail(userEmail: string, subject: string, text: string, html: string) {
	const transporter = nodemailer.createTransport({
		service: 'Outlook',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	})

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: userEmail,
		subject: subject,
		text: text,
		html: html,
	}
	
	return transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error', error)
		} else {
			console.log('Email sent', info.response)
		}
	})
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({ where: { email: createUserDto.email } });
    if (user) {
      throw new HttpException('User already exists', 400);
    }
    
    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    }

    const createdUser = await this.prisma.user.create({ data });
    if (!createdUser) {
      throw new HttpException('Error creating user', 500);
    }

    const createdClient = await this.prisma.client.create({
      data: {
        userId: createdUser.id
      }
    })
    if (!createdClient) {
      throw new HttpException('Error creating client', 500);
    }

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, 
      select: prismaExclude('User', ['password']),
    });
    if (!users) {
      throw new HttpException('Error finding users', 500);
    } else if (users.length === 0) {
      throw new HttpException('No users found', 404);
    }

    return users;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      select: prismaExclude('User', ['password']),
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {    
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
      include: {
        address: true
      }
    })

    if (!updatedUser) {
      throw new HttpException('Error updating user', 500);
    }

    return {
      ...updatedUser,
      password: undefined,
    };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const deletedUser = await this.prisma.user.delete({ where: { id } });
    if (!deletedUser) {
      throw new HttpException('Error deleting user', 500);
    }
    
    return "User deleted";
  }

  async updatePassword(id: string, updateUserPasswordDto: UpdateUserPasswordDto) {
    if (updateUserPasswordDto.currentPassword === updateUserPasswordDto.newPassword) {
      throw new HttpException('New password cannot be the same as the current password', 400);
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(updateUserPasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid current password', 401);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: await bcrypt.hash(updateUserPasswordDto.newPassword, 10),
      },
    })

    if (!updatedUser) {
      throw new HttpException('Error updating password', 500);
    }

    return {
      ...updatedUser,
      password: undefined,
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        token: hash,
      },
    })

    const link = `cultiva.com/passwordReset?token=${resetToken}&id=${user.id}`;
    
    sendEmail(
      user.email, 
      "Password Reset Request", 
      "Password Reset Request", 
      `<p>Please click the link below to reset your password:</p><a>${link}</a>`
    );

    return link;
  }

  async resetPassword(resetPasswordUserDto: ResetPasswordUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: resetPasswordUserDto.id } });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const userToken = user.token
    if (!userToken) {
      throw new Error("Invalid or expired password reset token");
    }

    const isValid = await bcrypt.compare(resetPasswordUserDto.token, userToken);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(resetPasswordUserDto.password, 10),
      },
    })

    if (!updatedUser) {
      throw new HttpException('Error updating password', 500);
    }

    sendEmail(
      user.email,
      'Password Reset Successfully',
      'Password Reset Successfully',
      '<p>Your password has been reset successfully.</p>'
    )

    return {
      ...updatedUser,
      password: undefined,
    }
  }

  async getUserOrders(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          { buy: { some: { clientId: user.id } } },
          { sale: { some: { producerId: user.id } } },
        ]
      },
      include: {
        buy: true,
        sale: true,
      }
    })

    if (!orders) {
      throw new HttpException('Error finding orders', 500);
    }

    const saleProductsId = orders.map((order) => order.sale.map((sale) => sale.productId))

    const buyProductsId = orders.map((order) => order.buy.map((buy) => buy.productId))

    const productsId = [...saleProductsId, ...buyProductsId]

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productsId.flat(),
        }
      }
    })

    if (!products) {
      throw new HttpException('Error finding products', 500);
    }

    return products
  }

  async getUserBuys(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const buys = await this.prisma.buy.findMany({
      where: {
        clientId: user.id
      },
      include: {
        product: true
      }
    })
    if (!buys) {
      throw new HttpException('Error finding buys', 500);
    }

    return buys
  }

  async getUserSales(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const sales = await this.prisma.sale.findMany({
      where: {
        producerId: user.id
      },
      include: {
        product: true
      }
    })
    if (!sales) {
      throw new HttpException('Error finding sales', 500);
    }

    return sales
  }

  async findBySearchArg(searchArg: string) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchArg } },
          { email: { contains: searchArg } },
        ],
      },
    });

    if (!users) {
      throw new HttpException('Error finding users', 500);
    } else if (users.length === 0) {
      throw new HttpException('No users found', 404);
    }

    return users
  }
}
