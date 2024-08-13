import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class PrintOnOffDto {
    @IsString()
    @IsIn(['0', '1'])
    @ApiProperty({
        description: 'Specify whether to turn printing on or off',
        example: '1',
        enum: ['0', '1'],
    })
    printOn: '0' | '1';
}

// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsIn } from 'class-validator';

// export class PrintOnOffDto {
//     @IsString()
//     @IsIn(['0', '1'])
//     @ApiProperty()
//     printOn: '0' | '1';
// }
