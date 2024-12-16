import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // 1.1 Import the mongoose module
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module'; // 2.1 Import the product module
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './orders/orders.module';
import { UserModule } from './users/users.module';
import { VerifyUserModule } from './verify-user/verify-user.module';
import { ImageModule } from './image/image.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule globally available
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI), // 1.2 Setup the database
    ProductModule, // 2.1 Add the product module
    UserModule,
    AuthModule,
    CartModule,
    OrderModule,
    VerifyUserModule,
    ImageModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
