import { Injectable } from '@nestjs/common';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';

@Injectable()
export class TratamientosService {
  private tratamientos = [
    { id: 1, descripcion: 'Antibiotico por infeccion', duracion: '7 dias', mascotaId: 1 },
    { id: 2, descripcion: 'Desparasitacion', duracion: '3 dias', mascotaId: 2 },
  ];

  findAll() {
    return this.tratamientos;
  }

  findOne(id: number) {
    return this.tratamientos.find((t) => t.id === id);
  }

  create(dto: CreateTratamientoDto) {
    const nuevo = {
      id: this.tratamientos.length + 1,
      descripcion: dto.descripcion,
      duracion: dto.duracion,
      mascotaId: dto.mascotaId,
    };
    this.tratamientos.push(nuevo);
    return nuevo;
  }

  update(id: number, dto: UpdateTratamientoDto) {
    const tratamiento = this.findOne(id);
    if (!tratamiento) return { message: 'Tratamiento no encontrado' };
    Object.assign(tratamiento, dto);
    return tratamiento;
  }

  remove(id: number) {
    this.tratamientos = this.tratamientos.filter((t) => t.id !== id);
    return { message: `Tratamiento con id ${id} eliminado` };
  }
}
