import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageDataDto } from './message-data.dto';

export class UpdateMessageTextDto {
    @ApiProperty({ description: 'Name of the message to be updated' })
    @IsNotEmpty()
    messageName: string;

    @ApiProperty({
        type: [MessageDataDto],
        description: 'Data for updating the message',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MessageDataDto)
    messageData: MessageDataDto[];
}
