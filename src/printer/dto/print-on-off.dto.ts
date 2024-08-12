import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class PrintOnOffDto {
    @IsString()
    @IsIn(['0', '1'])
    @ApiProperty()
    status: '0' | '1';
}
