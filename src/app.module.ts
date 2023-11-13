import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ProductModule } from './product/product.module';
import { ProducerModule } from './producer/producer.module';
import { ClientModule } from './client/client.module';
import { CommentModule } from './comment/comment.module';
import { FirebaseModule } from './modules/firebase/firebase.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, ProductModule, ProducerModule, ClientModule, CommentModule, FirebaseModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule {}
