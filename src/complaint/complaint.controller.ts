import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { Complaint } from './entities/complaint.entity';
import { Evidence } from './entities/evidence.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Complaints')
@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post('evidence')
  @ApiOperation({ summary: 'Create a new evidence' })
  @ApiResponse({ status: 201, description: 'The evidence has been created successfully.', type: Complaint })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  createEvidence(@Body() createEvidenceDto: CreateEvidenceDto) {
    return this.complaintService.createEvidence(createEvidenceDto);
  }

  @Post('validate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Validate complaint ID and password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Complaint ID',
          example: 'b0d2fa7d281',
        },
        pass: {
          type: 'string',
          description: 'Complaint password',
          example: 'pass123',
        },
      },
      required: ['id', 'pass'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Validation successful. Returns true if the ID and password match, false otherwise.',
    schema: {
      type: 'boolean',
      example: true,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Complaint with the provided ID not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  validateComplaintPass(@Body('id') id: string, @Body('pass') pass: string) {
    return this.complaintService.validateComplaintPass(id, pass);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new complaint' })
  @ApiResponse({ status: 201, description: 'The complaint has been created successfully.', type: Complaint })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintService.create(createComplaintDto);
  }

  @Get('evidences')
  @ApiOperation({ summary: 'Get all evidences' })
  @ApiResponse({ status: 200, description: 'The evidences has been retrieved successfully.', type: Complaint })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAllEvidences() {
    return this.complaintService.findAllEvidences();
  }

  @Get()
  @ApiOperation({ summary: 'Get all complaints' })
  @ApiResponse({ status: 200, description: 'The complaints has been retrieved successfully.', type: Complaint })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll() {
    return this.complaintService.findAll();
  }

  @Get('/evidence/:id')
  @ApiOperation({ summary: 'Get a complaint by idEvidence' })
  @ApiResponse({ status: 200, description: 'The evidence has been retrieved successfully.', type: Complaint })
  @ApiResponse({ status: 404, description: 'evidence not found' })
  async findOneEvidence(@Param('id') id: string): Promise<Evidence> {
    return await this.complaintService.findOneEvidence(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a complaint by idComplaint' })
  @ApiResponse({ status: 200, description: 'The complaint has been retrieved successfully.', type: Complaint })
  @ApiResponse({ status: 404, description: 'Complaint not found' })
  async findOne(@Param('id') id: string): Promise<Complaint> {
    return await this.complaintService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Patch a field complaint by idComplaint' })
  async update(@Param('id') id: string, @Body() updateComplaintDto: UpdateComplaintDto) {
    const complaint = await this.complaintService.update(id, updateComplaintDto);
    return { idComplaint: complaint.idComplaint };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a complaint by idComplaint' })
  async remove(@Param('id') id: string) {
    const complaint = await this.complaintService.remove(id);
    return { idComplaint: complaint.idComplaint };
  }
}
