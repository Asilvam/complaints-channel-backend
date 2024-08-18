import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DynamicFieldService } from './dynamic-field.service';
import { CreateDynamicFieldDto } from './dto/create-dynamic-field.dto';
import { UpdateDynamicFieldDto } from './dto/update-dynamic-field.dto';

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
  findOne(@Param('id') id: string) {
    return this.dynamicFieldService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDynamicFieldDto: UpdateDynamicFieldDto) {
    return this.dynamicFieldService.update(+id, updateDynamicFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dynamicFieldService.remove(+id);
  }
}
