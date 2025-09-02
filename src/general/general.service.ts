import { Injectable } from '@nestjs/common';
import * as net from 'net';
import { GeneralUpdateTextDto } from './dto/general-update-text.dto';
import { GeneralClearTextDto } from './dto/general-clear-text.dto';

@Injectable()
export class GeneralService {
    async updateText(dto: GeneralUpdateTextDto): Promise<string> {
        if (!dto.lines || dto.lines.length === 0) {
            throw new Error('Lines array is required');
        }

        const packet = this.createPacket(dto.lines);

        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            client.setTimeout(10000);

            client.connect(dto.port, dto.ip, () => {
                client.write(Uint8Array.from(packet));
            });

            client.on('data', (data) => {
                const response = data.toString('ascii').trim();

                if (response === '$48') {
                    resolve('Success: Data diterima oleh printer');
                } else {
                    resolve(`Response tidak dikenali: ${response}`);
                }
                client.destroy();
                // resolve(response);
            });

            client.on('error', (err) => {
                reject(err.message);
            });

            client.on('timeout', () => {
                client.destroy();
                reject('Connection timed out');
            });
        });
    }

    async clearText(dto: GeneralClearTextDto): Promise<string> {
        const STX = String.fromCharCode(0x02);
        const ETX = String.fromCharCode(0x03);
        const command = `${STX}C${ETX}`;
        const checksum = this.calculateChecksum(command);
        const finalCommand = `${command}${checksum}`;
        const packet = Buffer.from(finalCommand, 'ascii');

        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            client.setTimeout(10000);

            client.connect(dto.port, dto.ip, () => {
                client.write(Uint8Array.from(packet));
            });

            client.on('data', (data) => {
                const response = data.toString('ascii');
                client.destroy();
                resolve(response);
            });

            client.on('error', (err) => {
                reject(err.message);
            });

            client.on('timeout', () => {
                client.destroy();
                reject('Connection timed out');
            });
        });
    }

    private createPacket(
        lines: {
            font: string;
            horc: string;
            code: string;
            text: string;
            attribute?: string;
        }[],
    ): Buffer {
        const STX = String.fromCharCode(0x02);
        const ETX = String.fromCharCode(0x03);
        const LF = String.fromCharCode(0x0a);

        const dataLines = lines.map((line, index) => {
            const attr = line.attribute ?? '000000';
            const formattedLine = `${line.font}${line.horc}${line.code}${attr}${line.text}`;
            return index === 0 ? `T${formattedLine}` : formattedLine;
        });

        const body = dataLines.join(LF);
        const packetWithoutChecksum = `${STX}${body}${ETX}`;
        const checksum = this.calculateChecksum(packetWithoutChecksum);
        const finalPacket = `${packetWithoutChecksum}${checksum}`;

        return Buffer.from(finalPacket, 'ascii');
    }

    /**
     * Hitung checksum:
     * - Tidak termasuk STX (0x02)
     * - Termasuk semua karakter setelah STX sampai ETX (0x03)
     * - Hasil = sum % 256 → konversi ke HEX uppercase (2 digit)
     */
    private calculateChecksum(packet: string): string {
        let sum = 0;
        for (let i = 1; i < packet.length; i++) {
            sum += packet.charCodeAt(i);
        }
        sum = sum % 256;
        return sum.toString(16).toUpperCase().padStart(2, '0');
    }
}
