// src/auth/auth.service.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async enableMfa(idUser: string): Promise<string> {
    const secret = authenticator.generateSecret();
    await this.userService.updateMfaSecret(idUser, secret);
    return secret;
  }

  generateQRCode(email: string, secret: string): Promise<string> {
    const otpAuth = authenticator.keyuri(email, 'Complaint Channel', secret);
    return qrcode.toDataURL(otpAuth);
  }

  verifyToken(token: string, secret: string): boolean {
    const verify = authenticator.verify({ token, secret });
    if (!verify) {
      throw new UnauthorizedException('token is wrong');
    }
    return verify;
  }

  async login({ username, password }: LoginDto) {
    this.logger.log('Try login');
    const user = await this.userService.validateUserEmail(username);
    if (!user) {
      throw new UnauthorizedException('user is wrong');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }
    if (!user.isMfaEnabled) {
      const payload = { idUser: user.idUser, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '12h',
      });
      return {
        accessToken,
        username,
      };
    } else {
      return { isMfaEnabled: true, username };
    }
  }
}
