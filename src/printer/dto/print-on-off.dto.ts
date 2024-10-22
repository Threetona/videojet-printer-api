import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, Length, IsNumber } from 'class-validator';

export class PrintOnOffDto {
    @IsString()
    @IsIn(['0', '1'])
    @ApiProperty({
        description: 'Specify whether to turn printing on or off',
        example: '1',
        enum: ['0', '1'],
    })
    printOn: '0' | '1';

    @IsString()
    @Length(1, 15)
    @ApiProperty()
    IpAddress: string;

    @IsNumber()
    // @Length(1, 5)
    @ApiProperty({ default: 3100 })
    Port: number;
}

// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsIn } from 'class-validator';

// export class PrintOnOffDto {
//     @IsString()
//     @IsIn(['0', '1'])
//     @ApiProperty()
//     printOn: '0' | '1';
// }
