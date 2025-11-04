import { Injectable } from '@nestjs/common';
import { CreateDuenoDto } from './dto/create-dueno.dto';
import { UpdateDuenoDto } from './dto/update-dueno.dto';


@Injectable()
export class DuenosService {
  private duenos = [
    { id: 1, nombre: 'Laura Garcia', telefono: '123456' },
    { id: 2, nombre: 'Carlos Lopez', telefono: '654321' },
  ];

  findAll() {
    return this.duenos;
  }

  findOne(id: number) {
    return this.duenos.find(d => d.id === id);
  }

  create(dto: CreateDuenoDto) {
    const nuevo = { id: this.duenos.length + 1, ...dto };
    this.duenos.push(nuevo);
    return nuevo;
  }

  update(id: number, dto: UpdateDuenoDto) {
    const dueno = this.findOne(id);
    if (!dueno) return null;
    Object.assign(dueno, dto);
    return dueno;
  }
  remove(id: number) {
    this.duenos = this.duenos.filter(d => d.id !== id);
    return { message: `Dueno con id ${id} eliminado` };
  }
  

  
}
