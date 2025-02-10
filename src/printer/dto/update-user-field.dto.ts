import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserFieldDto {
    @IsString()
    @Length(1, 30)
    @ApiProperty()
    userFieldName: string;

    @IsString()
    @Length(1, 50)
    @IsOptional()
    @ApiProperty({ required: false })
    userFieldData?: string;

    @IsString()
    @Length(1, 30)
    @ApiProperty()
    IpAddress: string;

    @IsNumber()
    @ApiProperty({ default: 3100 })
    Port: number;
}
