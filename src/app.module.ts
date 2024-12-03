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
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
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
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: 'bb200afc0b3d3a',
          pass: '8cebcf2510af47',
        },
      },
    }),
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
