import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class FieldMessageDto {
    @IsString()
    @Length(1, 30)
    @ApiProperty()
    userFieldName: string;

    @IsString()
    @Length(1, 50)
    @IsOptional()
    @ApiProperty({ required: false })
    userFieldData?: string;
}
