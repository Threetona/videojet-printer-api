import { Module } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { PrinterController } from './printer.controller';

@Module({
    providers: [PrinterService],
    controllers: [PrinterController],
})
export class PrinterModule {}
