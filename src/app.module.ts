import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DuenosModule } from './duenos/duenos.module';
import { MascotasModule } from './mascotas/mascotas.module';
import { TurnosModule } from './turnos/turnos.module';
import { TratamientosModule } from './tratamientos/tratamientos.module';

@Module({
  imports: [DuenosModule, MascotasModule, TurnosModule, TratamientosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
