import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // 1.1 Import the mongoose module
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module'; // 2.1 Import the product module
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './orders/orders.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI), // 1.2 Setup the database
    ProductModule, // 2.1 Add the product module
    UserModule,
    AuthModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
