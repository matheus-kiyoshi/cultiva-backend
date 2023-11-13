import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FirebaseController],
  providers: [FirebaseService],
})
export class FirebaseModule {}
