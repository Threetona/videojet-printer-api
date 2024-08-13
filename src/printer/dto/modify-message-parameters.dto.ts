import { IsString, Length, Matches } from 'class-validator';

export class ModifyMessageParametersDto {
    @IsString()
    @Length(1, 1)
    readonly type: string = 'P';

    @IsString()
    @Length(1, 1)
    @Matches(/^[01]$/)
    readonly rev: string;

    @IsString()
    @Length(1, 1)
    @Matches(/^[01]$/)
    readonly inv: string;

    @IsString()
    @Length(4, 4)
    @Matches(/^[0-9]{4}$/)
    readonly wid: string;

    // Tambahkan validasi yang sesuai untuk setiap parameter lainnya
    @IsString()
    @Length(4, 4)
    readonly eht: string;

    @IsString()
    @Length(4, 4)
    readonly gap: string;

    @IsString()
    @Length(4, 4)
    readonly exp: string;

    @IsString()
    @Length(1, 1)
    readonly hejra: string;

    @IsString()
    @Length(1, 1)
    readonly dly: string;

    @IsString()
    @Length(1, 1)
    readonly bld: string;

    @IsString()
    @Length(1, 1)
    readonly drp: string;

    @IsString()
    @Length(1, 1)
    readonly rassub: string;

    @IsString()
    @Length(1, 1)
    readonly rlen: string;

    @IsString()
    @Length(1, 1)
    readonly ras: string;

    @IsString()
    @Length(1, 1)
    readonly rdlylen: string;

    @IsString()
    @Length(1, 1)
    readonly rdly: string;
}
