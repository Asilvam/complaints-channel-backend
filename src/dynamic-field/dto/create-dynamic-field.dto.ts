import { IsString, IsBoolean, IsIn } from 'class-validator';

export class CreateDynamicFieldDto {

  @IsString()
  name: string;

  @IsString()
  label: string;

  @IsString()
  @IsIn(['boolean', 'text', 'email', 'text-area', 'array-text'])
  type: string;

  @IsBoolean()
  visible: boolean;

  @IsBoolean()
  default: boolean;
}
