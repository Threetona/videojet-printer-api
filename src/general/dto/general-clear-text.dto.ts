import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class GeneralClearTextDto {
    @IsString()
    @IsNotEmpty()
    ip: string;

    @IsNumber()
    port: number;
}
