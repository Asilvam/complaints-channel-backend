import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComplaintDto {
  @ApiProperty({
    description: 'Detailed description of the complaint',
    example: 'The complainant was harassed by the defendant in the office.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Full name of the complainant',
    example: 'Benita Ruiz',
  })
  @IsNotEmpty()
  @IsString()
  fullNameComplainant: string;

  @ApiProperty({
    description: 'Document number of the complainant',
    example: 'A12345678-9',
  })
  @IsNotEmpty()
  @IsString()
  documentNumber: string;

  @ApiProperty({
    description: 'Email address of the complainant',
    example: 'benita.ruiz@example.com',
  })
  @IsNotEmpty()
  @IsString()
  emailComplainant: string;

  @ApiProperty({
    description: 'Full name of the defendant',
    example: 'Ronald Perez',
  })
  @IsNotEmpty()
  @IsString()
  fullNameDefendant: string;

  @ApiProperty({
    description: 'Current status of the complaint',
    example: 'open',
    enum: ['open', 'in_progress', 'resolved', 'closed'],
  })
  @IsOptional()
  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  status: string = 'open';

  @ApiProperty({
    description: 'Date when the complaint was filed',
    example: '2023-08-18T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dateFiled?: Date;

  @ApiProperty({
    description: 'Due date for the resolution of the complaint',
    example: '2023-09-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({
    description: 'Resolution details, if available',
    example: 'The case has been resolved amicably.',
  })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiProperty({
    description: 'ID of the person assigned to the case',
    example: 'Juan Perez',
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({
    description: 'Additional metadata associated with the complaint',
    example: { priority: 'high', sensitive: 'true' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;
}
