import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  logger = new Logger(JwtAuthGuard.name);
  canActivate(context: ExecutionContext): boolean {
    return super.canActivate(context) as boolean;
  }
}
