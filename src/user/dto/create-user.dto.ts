import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address of the user, used for login and notifications.',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Secure password for the user account.',
    example: 'strongPassword123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional({
    description: 'Optional MFA secret for enabling two-factor authentication using apps like Google Authenticator.',
    example: 'JBSWY3DPEHPK3PXP',
  })
  @IsOptional()
  @IsString()
  mfaSecret?: string;

  @ApiProperty({
    description: 'Role of the user in the system, defining their permissions.',
    example: 'administrator',
    enum: ['commission', 'administrator'],
  })
  @IsNotEmpty()
  @IsEnum(['commission', 'administrator'])
  role: string[];

  @ApiPropertyOptional({
    description: 'Indicates whether multi-factor authentication (MFA) is enabled for the user.',
    example: false,
  })
  @IsOptional()
  isMfaEnabled: boolean = false;
}
