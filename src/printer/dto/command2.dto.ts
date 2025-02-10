import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { PacketType } from '../types/packet-type.enum';

export class CommandDto2 {
    @IsString()
    @Length(1, 1)
    @ApiProperty()
    type: PacketType;

    @IsString()
    @ApiProperty()
    fieldName: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    fieldData?: string;
}
