import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DuenosService } from './duenos.service';
import { CreateDuenoDto } from './dto/create-dueno.dto';
import { UpdateDuenoDto } from './dto/update-dueno.dto';

@Controller('duenos')
export class DuenosController {
  constructor(private readonly duenosService: DuenosService) {}

  @Post()
  create(@Body() createDuenoDto: CreateDuenoDto) {
    return this.duenosService.create(createDuenoDto);
  }

  @Get()
  findAll() {
    return this.duenosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.duenosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDuenoDto: UpdateDuenoDto) {
    return this.duenosService.update(+id, updateDuenoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.duenosService.remove(+id);
  }
}
