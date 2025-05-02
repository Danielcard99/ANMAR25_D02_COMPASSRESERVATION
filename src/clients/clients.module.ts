import { Module } from '@nestjs/common';
import { ClientController } from './clients.controller';
import { ClientService } from './clients.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
