import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrinterModule } from './printer/printer.module';
import { GeneralModule } from './general/general.module';

@Module({
  imports: [PrinterModule, GeneralModule],
  controllers: [],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
