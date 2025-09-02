import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GeneralService } from './general.service';
import { GeneralUpdateTextDto } from './dto/general-update-text.dto';
import { GeneralClearTextDto } from './dto/general-clear-text.dto';

@Controller('general')
@ApiTags('General')
export class GeneralController {
    private readonly logger = new Logger(GeneralController.name);

    constructor(private readonly generalService: GeneralService) {}

    @Post('update-text')
    async updateText(@Body() dto: GeneralUpdateTextDto) {
        // this.logger.debug(`Received request: ${JSON.stringify(dto)}`);
        return this.generalService.updateText(dto);
    }

    @Post('clear-text')
    async clearText(@Body() dto: GeneralClearTextDto) {
        // this.logger.debug(
        //     `Received clear text request: ${JSON.stringify(dto)}`,
        // );
        return this.generalService.clearText(dto);
    }
}
