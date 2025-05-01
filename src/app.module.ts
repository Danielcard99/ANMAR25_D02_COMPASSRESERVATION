import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from './clients/clients.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClientModule,
    JwtModule.register({
      secret: `Yj3[xV0@borz-'#T3jE9l54"ySQlpA7+`,
      signOptions: { expiresIn: '100s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class AppModule {}
