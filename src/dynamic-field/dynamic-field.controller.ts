import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { DynamicFieldService } from './dynamic-field.service';
import { CreateDynamicFieldDto } from './dto/create-dynamic-field.dto';
import { DynamicField } from './entities/dynamic-field.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Dynamics Fields')
@Controller('dynamic-field')
export class DynamicFieldController {
  constructor(private readonly dynamicFieldService: DynamicFieldService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dynamic field' })
  @ApiResponse({ status: 201, description: 'The dynamic field has been successfully created.', type: DynamicField })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createDynamicFieldDto: CreateDynamicFieldDto) {
    return this.dynamicFieldService.create(createDynamicFieldDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all dynamic fields' })
  @ApiResponse({ status: 200, description: 'Array of all dynamic fields', type: [DynamicField] })
  findAll() {
    return this.dynamicFieldService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a dynamic field by ID' })
  @ApiParam({ name: 'id', description: 'ID of the dynamic field to retrieve' })
  @ApiResponse({ status: 200, description: 'The dynamic field has been successfully retrieved.', type: DynamicField })
  @ApiResponse({ status: 404, description: 'Dynamic field not found' })
  findOne(@Param('id') id: string): Promise<DynamicField> {
    return this.dynamicFieldService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a dynamic field by ID' })
  @ApiParam({ name: 'id', description: 'ID of the dynamic field to delete' })
  @ApiResponse({ status: 200, description: 'The dynamic field has been successfully deleted.', type: DynamicField })
  @ApiResponse({ status: 404, description: 'Dynamic field not found' })
  remove(@Param('id') id: string) {
    return this.dynamicFieldService.remove(id);
  }
}
