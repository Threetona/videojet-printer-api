import {
    IsArray,
    IsNotEmpty,
    IsString,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LineDto {
    @IsString()
    @IsNotEmpty()
    font: string;

    @IsString()
    @IsNotEmpty()
    horc: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    text: string;
}

export class GeneralUpdateTextDto {
    @IsString()
    @IsNotEmpty()
    ip: string;

    @IsNumber()
    port: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LineDto)
    lines: LineDto[];
}
