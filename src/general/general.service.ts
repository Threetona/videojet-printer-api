import * as net from 'net';
import { Injectable } from '@nestjs/common';
import { GeneralUpdateTextDto } from './dto/general-update-text.dto';
import { GeneralClearTextDto } from './dto/general-clear-text.dto';
import { createPacket } from './utils/packet-builder';
import { calculateChecksum } from './utils/checksum';
import { parseErrorStatus } from './utils/error-parser';
import { VideojetWarningInfo } from './errors/videojet-warning.map';
import { PacketType } from '../printer/types/packet-type.enum';

@Injectable()
export class GeneralService {
    async updateText(dto: GeneralUpdateTextDto): Promise<any> {
        if (!dto.lines || dto.lines.length === 0) {
            throw new Error('Lines array is required');
        }

        const packet = createPacket(PacketType.UpdateMessageText, dto.lines);

        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            client.setTimeout(10000);

            client.connect(dto.port, dto.ip, () => {
                client.write(Uint8Array.from(packet));
            });

            client.on('data', async (data) => {
                const response = data.toString('ascii').trim();

                setTimeout(async () => {
                    const message = await this.handlePrinterResponse(
                        dto.ip,
                        dto.port,
                        response,
                    );
                    resolve(message);
                }, 500);

                client.destroy();
            });

            client.on('error', (err) =>
                reject(`Network error: ${err.message}`),
            );
            client.on('timeout', () => {
                client.destroy();
                reject('Connection timed out');
            });
        });
    }

    private async handlePrinterResponse(
        ip: string,
        port: number,
        ack: string,
    ): Promise<any> {
        try {
            const warnings = await this.getErrorStatus(ip, port);

            if (warnings.length === 0) {
                return {
                    status: 'Success',
                    ack,
                    warning: [],
                };
            }

            return {
                status: 'Success With Warnings',
                ack,
                warning: warnings, // sudah array of { code, message, solution }
            };
        } catch (err) {
            return {
                status: 'Partial Success',
                ack,
                message: `Data diterima, tapi gagal membaca warning status (${err})`,
                warning: [],
            };
        }
    }

    async clearText(dto: GeneralClearTextDto): Promise<any> {
        const STX = String.fromCharCode(0x02);
        const ETX = String.fromCharCode(0x03);
        const command = `${STX}${PacketType.DeleteMessageText}${ETX}`;
        const checksum = calculateChecksum(command);
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
                setTimeout(async () => {
                    const message = await this.handlePrinterResponse(
                        dto.ip,
                        dto.port,
                        response,
                    );
                    resolve(message);
                }, 500);
                client.destroy();
            });

            client.on('error', (err) => reject(err.message));
            client.on('timeout', () => {
                client.destroy();
                reject('Connection timed out');
            });
        });
    }

    private getErrorStatus(
        ip: string,
        port: number,
    ): Promise<VideojetWarningInfo[]> {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            client.setTimeout(5000);

            const STX = String.fromCharCode(0x02);
            const ETX = String.fromCharCode(0x03);
            const request = `${STX}${PacketType.RequestErrorStatus}${ETX}`;

            client.connect(port, ip, () => {
                client.write(request);
            });

            client.on('data', (data) => {
                const hex = data.toString('hex').toUpperCase();
                const warnings = parseErrorStatus(hex);
                resolve(warnings);
                client.destroy();
            });

            client.on('error', (err) => reject(err.message));
            client.on('timeout', () => {
                client.destroy();
                reject('Timeout baca error status');
            });
        });
    }
}
