import { StockSyncService } from './stock-sync.service';
import { StockCronController } from './stock-cron.controller';
import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from '../prisma.service';
import { AdminModule } from '../admin/admin.module'; 

@Module({
  imports: [AdminModule], 
  controllers: [VehiclesController, StockCronController],
  providers: [VehiclesService, PrismaService, StockSyncService],
})
export class VehiclesModule {}
