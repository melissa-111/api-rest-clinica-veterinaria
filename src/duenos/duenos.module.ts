import { Module } from '@nestjs/common';
import { DuenosService } from './duenos.service';
import { DuenosController } from './duenos.controller';
import { MascotasModule } from './mascotas/mascotas.module';

@Module({
  controllers: [DuenosController],
  providers: [DuenosService],
  imports: [MascotasModule],
})
export class DuenosModule {}
