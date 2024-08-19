import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { Complaint } from './entities/complaint.entity';
import { Evidence } from './entities/evidence.entity';

@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post('evidence')
  createEvidence(@Body() createEvidenceDto: CreateEvidenceDto) {
    return this.complaintService.createEvidence(createEvidenceDto);
  }

  @Post()
  create(@Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintService.create(createComplaintDto);
  }

  @Get('evidences')
  findAllEvidences() {
    return this.complaintService.findAllEvidences();
  }

  @Get()
  findAll() {
    return this.complaintService.findAll();
  }

  @Get('/evidence/:id')
  async findOneEvidence(@Param('id') id: string): Promise<Evidence> {
    return await this.complaintService.findOneEvidence(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Complaint> {
    return await this.complaintService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateComplaintDto: UpdateComplaintDto) {
    const complaint = await this.complaintService.update(id, updateComplaintDto);
    return { idComplaint: complaint.idComplaint };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const complaint = await this.complaintService.remove(id);
    return { idComplaint: complaint.idComplaint };
  }
}
