import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
    Get,
    Logger,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { PrinterService } from './printer.service';
import { PrintOnOffDto } from './dto/print-on-off.dto';
import { MessageSelectDto } from './dto/message-select.dto';
import { UpdateUserFieldDto } from './dto/update-user-field.dto';
import { UpdateMessageTextDto } from './dto/update-message-text.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateMultyUserFieldDto } from './dto/update-multy-user-field.dto';

@Controller('printer')
@ApiTags('Implementasi paket protokol mesin Videojet')
export class PrinterController {
    private readonly logger = new Logger(PrinterController.name);

    constructor(private readonly printerService: PrinterService) {}

    @Get('error-status/:IP/:Port')
    async getErrorStatus(
        @Param('IP') IP: string,
        @Param('Port', ParseIntPipe) Port: number,
    ) {
        try {
            const result = await this.printerService.getErrorStatus(IP, Port);
            return {
                statusCode: HttpStatus.OK,
                errorStatus: result.errorStatus,
                message: result.message,
            };
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: error,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get('stop-jet/:IP/:Port')
    async stopJet(
        @Param('IP') IP: string,
        @Param('Port', ParseIntPipe) Port: number,
    ): Promise<string> {
        try {
            const result = await this.printerService.stopJet(IP, Port);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Endpoint to turn printing on or off.
     * @param body Contains the printOn parameter to turn printing on (1) or off (0).
     * @returns A response indicating the result of the command.
     */
    @Post('print-on-off')
    async printOnOff(@Body() printOnOffDto: PrintOnOffDto): Promise<string> {
        this.logger.log(
            `Received print on/off request with value: ${printOnOffDto.printOn}`,
        );
        try {
            const result = await this.printerService.printOnOff(printOnOffDto);
            return result;
        } catch (error) {
            this.logger.error('Print On/Off command failed', error);
            throw new Error('Print On/Off command failed');
        }
    }

    @Post('select-message')
    async selectMessage(@Body() messageSelectDto: MessageSelectDto) {
        this.logger.log(
            `Received message select request with name: ${messageSelectDto.messageName}`,
        );
        try {
            const result =
                await this.printerService.selectMessage(messageSelectDto);
            return { message: result };
        } catch (error) {
            this.logger.error('Message select failed', error);
            throw new Error('Message select command failed');
        }
    }

    @Post('update-message-text')
    @ApiOperation({ summary: 'Update message text' })
    @ApiResponse({
        status: 200,
        description: 'Message text updated successfully.',
    })
    @ApiResponse({ status: 400, description: 'Invalid request payload.' })
    async updateMessageText(
        @Body() updateMessageTextDto: UpdateMessageTextDto,
    ) {
        try {
            const result = await this.printerService.updateMessageText(
                updateMessageTextDto.messageName,
                updateMessageTextDto.messageData,
                updateMessageTextDto.IpAddress,
                updateMessageTextDto.Port,
            );
            return { message: result };
        } catch (error) {
            throw new Error(
                `Update Message Text command failed: ${error.message}`,
            );
        }
    }

    @Post('update-user-field')
    async updateUserFieldData(
        @Body() updateUserFieldDto: UpdateUserFieldDto,
    ): Promise<string> {
        const { userFieldName, userFieldData, IpAddress, Port } =
            updateUserFieldDto;
        try {
            return await this.printerService.updateUserFieldData(
                userFieldName,
                userFieldData,
                IpAddress,
                Port,
            );
        } catch (error) {
            throw new Error(
                `Update User Field Data command failed: ${error.message}`,
            );
        }
    }

    @Post('update-multy-user-field')
    async updateMultyUserField(
        @Body() updateMultyUserFieldDto: UpdateMultyUserFieldDto,
    ): Promise<string> {
        return this.printerService.updateMultyUserField(
            updateMultyUserFieldDto,
        );
    }

    @Get('delete-message-text/:IP/:Port')
    async deleteMessageText(
        @Param('IP') IP: string,
        @Param('Port', ParseIntPipe) Port: number,
    ) {
        try {
            const result = await this.printerService.deleteMessageText(
                IP,
                Port,
            );
            return { message: result };
        } catch (error) {
            this.logger.error('Delete Message Text command failed', error);
            throw new HttpException(
                'Delete Message Text command failed',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
