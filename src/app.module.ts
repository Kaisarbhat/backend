import { Module, Global } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { JwtModule } from '@nestjs/jwt';
import { PaymentModule } from './payment/payment.module';
import { AdminModule } from './admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UsersModule,
    EventsModule,
    JwtModule.register({
      global: true,
    }),
    PaymentModule,
    AdminModule,
    PassportModule.register({}),
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
