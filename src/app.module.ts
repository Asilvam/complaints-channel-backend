import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    FilesModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
