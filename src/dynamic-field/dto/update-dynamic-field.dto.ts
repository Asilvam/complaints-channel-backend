import { PartialType } from '@nestjs/swagger';
import { CreateDynamicFieldDto } from './create-dynamic-field.dto';

export class UpdateDynamicFieldDto extends PartialType(CreateDynamicFieldDto) {}
