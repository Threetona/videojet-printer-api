import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
    ValidateNested,
} from 'class-validator';
import { FieldMessageDto } from './field.message.dto';

export class UpdateMultyUserFieldDto {
    @ApiProperty({ description: 'Name of the message to be updated' })
    @IsNotEmpty()
    @IsString()
    messageName: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FieldMessageDto)
    @ApiProperty({ type: [FieldMessageDto] }) // Swagger metadata for array of objects
    messageData: FieldMessageDto[];

    @IsString()
    @Length(1, 15)
    @ApiProperty()
    IpAddress: string;

    @IsNumber()
    @ApiProperty({ default: 3100 })
    Port: number;
}
