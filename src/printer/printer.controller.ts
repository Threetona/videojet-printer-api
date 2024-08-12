import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
import { CommandDto } from './dto/command.dto';
import { CommandDto2 } from './dto/command2.dto';
import { PrinterService } from './printer.service';
import { PacketType } from './types/packet-type.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandEntity } from './entities/Command.entity';

@Controller('printer')
@ApiTags('Implementasi paket protokol mesin Videojet')
export class PrinterController {
    constructor(private readonly printerService: PrinterService) {}

    @Post('send-multy-command')
    @ApiResponse({
        status: 200,
        description: 'Successful response',
        type: [CommandEntity],
    })
    async sendCommand(
        @Body() commands: CommandDto[],
    ): Promise<{ status: string; message: string[] }> {
        if (
            !commands.every((cmd: any) =>
                Object.values(PacketType).includes(cmd.type),
            )
        ) {
            throw new BadRequestException('Invalid command type');
        }

        try {
            const result =
                await this.printerService.sendCommandsToPrinter(commands);
            return {
                status: 'success',
                message: result, // Add additional result details if needed
            };
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('send-command')
    @ApiResponse({
        status: 200,
        description: 'Successful response',
        type: [CommandEntity],
    })
    async sendCommand2(@Body() commandDto: CommandDto2) {
        try {
            const result =
                await this.printerService.sendCommandToPrinter(commandDto);
            return { status: 'success', message: result };
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}