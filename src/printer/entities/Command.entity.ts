import { ApiProperty } from '@nestjs/swagger';

export class CommandEntity {
    constructor(partial: Partial<CommandEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    status: string;
    @ApiProperty()
    message: string;
}
