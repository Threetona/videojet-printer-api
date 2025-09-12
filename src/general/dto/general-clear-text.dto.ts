import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class GeneralClearTextDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '192.168.1.100',
        description: 'IP address printer',
    })
    ip: string;

    @IsNumber()
    @ApiProperty({ example: 3100, description: 'Port default printer' })
    port: number;
}
