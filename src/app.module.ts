import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ComplaintModule } from './complaint/complaint.module';
import { DynamicFieldModule } from './dynamic-field/dynamic-field.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    FilesModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    ComplaintModule,
    DynamicFieldModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
