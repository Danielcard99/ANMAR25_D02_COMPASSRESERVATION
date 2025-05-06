import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ClientModule } from './clients/clients.module';
import { SpaceModule } from './space/space.module';
import { ResourcesModule } from './resources/resources.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ClientModule,
    SpaceModule,
    ResourcesModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
