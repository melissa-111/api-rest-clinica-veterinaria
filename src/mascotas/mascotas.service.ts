import { Injectable } from '@nestjs/common';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

@Injectable()
export class MascotasService {
  private mascotas = [
    { id: 1, nombre: 'Firulais', especie: 'Perro', duenoId: 1 },
    { id: 2, nombre: 'Michi', especie: 'Gato', duenoId: 2 },
  ];

  create(dto: CreateMascotaDto) {
    const nueva = {
      id: this.mascotas.length + 1,
      nombre: dto.nombre,
      especie: dto.especie,
      duenoId: dto.duenoId,
    };
    this.mascotas.push(nueva);
    return nueva;
  }
  

  findAll() {
    return this.mascotas;
  }

  findOne(id: number) {
    return this.mascotas.find(m => m.id === id);
  }

  update(id: number, dto: UpdateMascotaDto) {
    const mascota = this.findOne(id);
    if (!mascota) return null;
    Object.assign(mascota, dto);
    return mascota;
  }

  remove(id: number) {
    this.mascotas = this.mascotas.filter(m => m.id !== id);
    return { message: `Mascota con id ${id} eliminada` };
  }
}
