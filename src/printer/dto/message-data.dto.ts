import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class MessageDataDto {
    @ApiProperty({ description: 'Font number for the text' })
    @IsString()
    @Length(2, 2)
    fontNum: string;

    @ApiProperty({ description: 'Horizontal position of the text' })
    @IsString()
    @Length(4, 4)
    horc: string;

    @ApiProperty({ description: 'Vertical position of the text' })
    @IsString()
    @Length(3, 3)
    verc: string;

    @ApiProperty({ description: 'Attributes of the text' })
    @IsString()
    @Length(6, 6)
    attrib: string;

    @ApiProperty({ description: 'Text to be displayed' })
    @IsString()
    messageText: string;
}
