import { PartialType } from '@nestjs/mapped-types';
import { CreateDuenoDto } from './create-dueno.dto';

export class UpdateDuenoDto extends PartialType(CreateDuenoDto) {}



