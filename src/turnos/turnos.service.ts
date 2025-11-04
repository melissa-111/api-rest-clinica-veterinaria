import { Injectable } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
  private turnos = [
    { id: 1, fecha: '2025-11-03', hora: '10:00', mascotaId: 1, motivo: 'Vacunación' },
    { id: 2, fecha: '2025-11-04', hora: '14:30', mascotaId: 2, motivo: 'Control general' },
  ];

  findAll() {
    return this.turnos;
  }

  findOne(id: number) {
    return this.turnos.find((t) => t.id === id);
  }

  create(dto: CreateTurnoDto) {
    const nuevo = {
      id: this.turnos.length + 1,
      fecha: dto.fecha,
      hora: dto.hora,
      mascotaId: dto.mascotaId,
      motivo: dto.motivo,
    };
    this.turnos.push(nuevo);
    return nuevo;
  }

  update(id: number, dto: UpdateTurnoDto) {
    const turno = this.findOne(id);
    if (!turno) return { message: 'Turno no encontrado' };
    Object.assign(turno, dto);
    return turno;
  }

  remove(id: number) {
    this.turnos = this.turnos.filter((t) => t.id !== id);
    return { message: `Turno con id ${id} eliminado` };
  }
}
