import {
    IsArray,
    IsNotEmpty,
    IsString,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class LineDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '00',
        description: 'Font yang digunakan adalah code ASCI dari mesin',
    })
    font: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '0000', description: 'Horizontal alignment' })
    horc: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '034', description: 'Kode unik untuk line' })
    code: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Hello World',
        description: 'Teks yang akan dicetak',
    })
    text: string;
}

export class GeneralUpdateTextDto {
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

    @ApiProperty({
        type: () => LineDto,
        isArray: true,
        description: 'Daftar line text yang akan dikirim',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LineDto)
    lines: LineDto[];
}
