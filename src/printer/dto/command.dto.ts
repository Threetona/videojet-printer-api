import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PacketType } from '../types/packet-type.enum';

export class CommandDto {
    @IsEnum(PacketType, { message: 'type must be a valid PacketType' })
    @ApiProperty({
        description: 'Type of the command',
        example: 'U',
        enum: PacketType,
    })
    type: PacketType;

    @IsString({ message: 'field name must be a string' })
    @ApiProperty({
        description: 'field name for the command',
        example: 'TITLE1',
    })
    fieldName: string;

    @IsString({ message: 'field data must be a string' })
    @IsOptional()
    @ApiProperty({
        description: 'Optional additional data for the command',
        example: 'PRINT LABEL KARA Lait de coco',
        required: false,
    })
    fieldData?: string;
}

// export class CommandDto {
//     @IsString()
//     @Length(1, 1)
//     @ApiProperty()
//     type: PacketType;

//     @IsString()
//     @ApiProperty()
//     data: string;

//     @IsString()
//     @IsOptional()
//     @ApiProperty({ required: false })
//     data2?: string;
// }
