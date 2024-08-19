import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { DynamicFieldService } from './dynamic-field.service';
import { CreateDynamicFieldDto } from './dto/create-dynamic-field.dto';
import { DynamicField } from './entities/dynamic-field.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Dynamics Fields')
@Controller('dynamic-field')
export class DynamicFieldController {
  constructor(private readonly dynamicFieldService: DynamicFieldService) {}

  @Post()
  create(@Body() createDynamicFieldDto: CreateDynamicFieldDto) {
    return this.dynamicFieldService.create(createDynamicFieldDto);
  }

  @Get()
  findAll() {
    return this.dynamicFieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DynamicField> {
    return this.dynamicFieldService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dynamicFieldService.remove(id);
  }
}
