import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

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
}
