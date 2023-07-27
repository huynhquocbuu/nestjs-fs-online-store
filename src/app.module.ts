import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ProductsController } from './products.controller';
import { ProductsService } from './models/products.service';
import { Product } from './models/product.entity';
import { AdminModule } from './admin/admin.module';
import { User } from './models/user.entity';
import { UsersService } from './models/users.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';


@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports : [ConfigModule],
      useFactory: (configService : ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: true,
      }),
      inject: [ConfigService]
  }),
  TypeOrmModule.forFeature([Product, User]),
  AdminModule,
  AuthModule,
  CartModule
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService, ProductsService, UsersService],
  exports: [ProductsService, UsersService],
})
export class AppModule {}
