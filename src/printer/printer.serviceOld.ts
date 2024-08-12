import { Injectable } from '@nestjs/common';
import * as net from 'net';
import { CommandDto } from './dto/command.dto';

// with xcode

@Injectable()
export class PrinterServiceOld {
    private createProtocolPacketOld(
        type: string,
        data: string,
        data2: string,
    ): string {
        const STX = String.fromCharCode(0x02);
        const ETX = String.fromCharCode(0x03);
        const LF = String.fromCharCode(0x0a);
        // const LF = String.fromCharCode(0x03);
        // const T = String.fromCharCode(0x74);
        // const packet = `<STX>${type}BUYER<LF>${data}<ETX>`;
        const packet = `${STX}${type}${data}${LF}${data2}${ETX}`;
        // packet = `${STX}${type}${data2}${LF}51${ETX}`;
        return packet;
    }
    private createProtocolPacketOld2(
        type: string,
        data: string,
        data2: string,
    ): string {
        const STX = String.fromCharCode(0x02);
        const ETX = String.fromCharCode(0x03);
        const LF = String.fromCharCode(0x0a);
        const packet = `${STX}${type}${data}${LF}${data2}${ETX}`;
        return packet;
    }

    private calculateChecksumOld(packet: string): string {
        let sum = 0;
        for (let i = 1; i < packet.length - 1; i++) {
            sum += packet.charCodeAt(i);
        }
        sum = sum % 256;
        const highNibble = Math.floor(sum / 16)
            .toString(16)
            .toUpperCase();
        const lowNibble = (sum % 16).toString(16).toUpperCase();
        return `${highNibble}${lowNibble}`;
    }

    private createProtocolPacket(
        type: string,
        data: string,
        data2?: string, // data2 is optional and used for "Update Message Text"
    ): string {
        const STX = String.fromCharCode(0x02);
        const ETX = String.fromCharCode(0x03);
        const LF = String.fromCharCode(0x0a);

        let packet: string;

        switch (type) {
            case 'M': // "Message Select"
            case 'C': // "Delete Message Text"
                packet = `${STX}${type}${data}${ETX}`;
                break;
            case 'U': // "Update Message Text"
                packet = `${STX}${type}${data}${LF}${data2 || ''}${ETX}`;
                break;
            default:
                throw new Error('Invalid type');
        }

        const checksum = this.calculateChecksum(packet);
        return `${packet}${checksum}`;
    }

    private calculateChecksum(packet: string): string {
        let sum = 0;
        // Calculate checksum for the portion between STX and ETX
        for (let i = 1; i < packet.length - 3; i++) {
            // Skip STX at start and ETX at end
            sum += packet.charCodeAt(i);
        }
        sum = sum % 256;
        const highNibble = Math.floor(sum / 16)
            .toString(16)
            .toUpperCase()
            .padStart(1, '0'); // Ensure high nibble is a single hex digit
        const lowNibble = (sum % 16)
            .toString(16)
            .toUpperCase()
            .padStart(1, '0'); // Ensure low nibble is a single hex digit
        return `${highNibble}${lowNibble}`;
    }

    async sendCommandToPrinter(commandDto: CommandDto): Promise<string> {
        return new Promise((resolve, reject) => {
            const packet = this.createProtocolPacket(
                commandDto.type,
                commandDto.data,
                commandDto.data2,
            );
            const checksum = this.calculateChecksum(packet);

            const client = new net.Socket();

            client.connect(3100, '192.168.7.22', () => {
                client.write(packet);
            });

            client.on('data', (data) => {
                const response = data.toString();
                if (response.startsWith('$')) {
                    const receivedChecksum = response.substring(1, 3);
                    if (receivedChecksum === checksum) {
                        resolve('Command executed successfully');
                    } else {
                        reject('Checksum mismatch');
                    }
                } else if (response.startsWith('!')) {
                    reject('Command failed');
                }
                client.destroy();
            });

            client.on('error', (err) => {
                reject(`Error: ${err.message}`);
            });
        });
    }
}
