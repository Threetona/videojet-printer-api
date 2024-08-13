import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class MessageSelectDto {
    @IsString()
    @Length(1, 30)
    @ApiProperty({
        description: 'Nama pesan yang ingin dipilih',
        example: 'MyMessage',
    })
    messageName: string;
}
