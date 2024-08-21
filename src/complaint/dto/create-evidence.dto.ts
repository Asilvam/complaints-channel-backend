import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEvidenceDto {
  @ApiProperty({
    description: 'The ID of the file associated with the evidence',
    example: 'file123',
  })
  @IsString()
  @IsNotEmpty()
  idFile: string;

  @ApiProperty({
    description: 'The ID of the complaint associated with the evidence',
    example: 'complaint456',
  })
  @IsString()
  @IsNotEmpty()
  idComplaint: string;

  @ApiProperty({
    description: 'Optional description of the evidence',
    example: 'This is the description of the evidence.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
