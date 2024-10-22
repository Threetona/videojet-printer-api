import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { UpdateUserFieldDto } from './update-user-field.dto';

export class UpdateMultyUserFieldDtoOld extends PartialType(
    UpdateUserFieldDto,
) {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => UpdateUserFieldDto)
    userFields: UpdateUserFieldDto[];
}
