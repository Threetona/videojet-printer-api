import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class MessageSelectDto {
    @IsString()
    @Length(1, 30)
    @ApiProperty({
        description: 'Nama pesan yang ingin dipilih',
        example: 'MyMessage',
    })
    messageName: string;

    @IsString()
    @Length(1, 15)
    @ApiProperty()
    IpAddress: string;

    @IsNumber()
    // @Length(1, 5)
    @ApiProperty({ default: 3100 })
    Port: number;
}
