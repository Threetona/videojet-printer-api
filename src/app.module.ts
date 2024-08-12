import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrinterModule } from './printer/printer.module';

@Module({
  imports: [PrinterModule],
  controllers: [],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
