import { Controller, Post, Body, Request, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard'; // Import your JWT guard

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('enable-mfa')
  @ApiOperation({ summary: 'Enable Multi-Factor Authentication' })
  @ApiResponse({ status: 200, description: 'MFA enabled and QR code generated' })
  async enableMfa(@Request() req) {
    const secret = await this.authService.enableMfa(req.user.idUser);
    const qrCodeDataURL = await this.authService.generateQRCode(req.user.email, secret);
    return { qrCodeDataURL };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('verify-mfa')
  @ApiOperation({ summary: 'Verify MFA Token' })
  @ApiResponse({ status: 200, description: 'MFA token verified successfully' })
  async verifyMfa(@Request() req, @Body('token') token: string) {
    const user = await this.userService.findOne(req.user.idUser);
    if (!user.mfaSecret) {
      throw new Error('MFA is not enabled for this user');
    }
    const isValid = this.authService.verifyToken(token, user.mfaSecret);
    if (!isValid) {
      throw new Error('Invalid MFA token');
    }
    return { success: true };
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
