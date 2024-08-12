import { Injectable, Logger } from '@nestjs/common';
import * as net from 'net';
import { CommandDto } from './dto/command.dto';
import { PacketType } from './types/packet-type.enum';
import { CommandDto2 } from './dto/command2.dto';

@Injectable()
export class PrinterService {
    private readonly logger = new Logger(PrinterService.name);

    private createProtocolPacket(
        type: PacketType,
        data: string,
        data2?: string, // data2 is optional and used for "Update Message Text"
    ): string {
        const STX = String.fromCharCode(0x02);
        const ETX = String.fromCharCode(0x03);
        const LF = String.fromCharCode(0x0a); // Line Feed (LF) is used as separator

        let packet: string;

        switch (type) {
            case PacketType.SetMessageParameters:
                packet = `${STX}${data}${ETX}`;
                break;
            case PacketType.MessageSelect:
                packet = `${STX}${type}${data}${ETX}`;
                break;
            case PacketType.DeleteMessageText:
                packet = `${STX}${type}${data}${ETX}`;
                break;
            case PacketType.StopJet: // Handle StopJet command
                packet = `${STX}${type}${data}${ETX}`;
                break;
            case PacketType.PrintOnOff: // Handle Print On Off
                packet = `${STX}${type}${ETX}`;
                break;
            case PacketType.UpdateMessageText:
                // [STX] [TYPE] [USER FIELD NAME] [SEP] [USER FIELD DATA] [ETX]
                packet = `${STX}${type}${data}${LF}${data2 || ''}${ETX}`;
                // packet = `${STX}${type}${data}${LF}${data2 || ''}${ETX}`;
                break;
            case PacketType.UpdateUserFieldData:
                packet = `${STX}${type}${data}${LF}${data2 || ''}${ETX}`;
                break;
            case PacketType.DeleteUserFieldData:
                packet = `${STX}${type}${data}${ETX}`;
                break;
            case PacketType.RequestErrorStatus:
                packet = `${STX}${type}${ETX}`;
                break;
            case PacketType.RequestCurrentSelectedMessage:
                packet = `${STX}${type}${ETX}`;
                break;
            case PacketType.SetDateAndTime:
                packet = `${STX}${type}[YY][MM][DD]${ETX}`;
                break;
            default:
                throw new Error('Invalid type');
        }

        const checksum = this.calculateChecksum(packet);
        return `${packet}${checksum}`;
    }

    private calculateChecksum(packet: string): string {
        let sum = 0;
        for (let i = 1; i < packet.length - 3; i++) {
            sum += packet.charCodeAt(i);
        }
        sum = sum % 256;
        const highNibble = Math.floor(sum / 16)
            .toString(16)
            .toUpperCase()
            .padStart(1, '0');
        const lowNibble = (sum % 16)
            .toString(16)
            .toUpperCase()
            .padStart(1, '0');
        return `${highNibble}${lowNibble}`;
    }

    private calculateChecksumOld(packet: string): string {
        let sum = 0;
        // Calculate checksum for the portion between STX and ETX
        for (let i = 1; i < packet.length - 3; i++) {
            // Skip STX and ETX
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

    // check machine
    async checkMachineStatus(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const packet = this.createProtocolPacket(
                    PacketType.RequestErrorStatus,
                    '',
                );

                const client = new net.Socket();

                client.connect(3100, '192.168.6.210', () => {
                    this.logger.log('Koneksi ke mesin berhasil');
                    client.write(packet);
                });

                client.on('data', (data) => {
                    const response = data.toString().trim();
                    this.logger.log('Respons dari mesin:', response);

                    // Pastikan format respons: [STX][EEEEEE][A][ETX]
                    if (
                        response.length >= 8 &&
                        response.startsWith(String.fromCharCode(0x02)) &&
                        response.endsWith(String.fromCharCode(0x03))
                    ) {
                        const status = response.substring(
                            1,
                            response.length - 1,
                        ); // Menghapus STX dan ETX

                        if (
                            status.length === 7 &&
                            /^[0-9A-F]{7}$/.test(status)
                        ) {
                            // Jika responsnya adalah 0000000
                            if (status === '0000000') {
                                resolve('Machine On');
                            } else {
                                resolve('Machine Off');
                                // resolve(
                                //     'Mesin dalam keadaan mati atau kesalahan lainnya',
                                // );
                            }
                        } else {
                            reject('Format respons tidak valid');
                        }
                    } else {
                        reject('Format respons tidak valid');
                    }

                    client.destroy();
                });

                client.on('error', (err) => {
                    // this.logger.error('Error koneksi:', err.message);
                    reject(`Error koneksi: ${err.message}`);
                });

                client.on('close', () => {
                    this.logger.log('Koneksi ditutup');
                });
            } catch (error) {
                this.logger.error(
                    'Error di checkMachineStatus:',
                    error.message,
                );
                reject(`Error: ${error.message}`);
            }
        });
    }

    async sendCommandsToPrinter(commands: CommandDto[]): Promise<string[]> {
        const results: string[] = [];
        const maxRetries = 3; // Max retries for each command
        const retryDelay = 1000; // Delay between retries in ms

        for (const command of commands) {
            let attempt = 0;
            let success = false;

            while (attempt < maxRetries && !success) {
                try {
                    const packet = this.createProtocolPacket(
                        command.type as PacketType,
                        command.data,
                        command.data2,
                    );
                    const checksum = this.calculateChecksum(packet);
                    this.logger.log('Sending packet multy column:', packet);

                    const client = new net.Socket();

                    await new Promise<void>((resolve, reject) => {
                        client.connect(3100, '192.168.6.210', () => {
                            client.write(packet);
                        });

                        client.on('data', (data) => {
                            const response = data.toString();
                            this.logger.log('Response from printer:', response);
                            if (response.startsWith('$')) {
                                const receivedChecksum = response.substring(
                                    1,
                                    3,
                                );
                                if (receivedChecksum === checksum) {
                                    results.push(
                                        'Command executed successfully',
                                    );
                                    success = true;
                                } else {
                                    results.push('Checksum mismatch');
                                    success = true;
                                }
                            } else if (response.startsWith('!')) {
                                results.push('Command failed');
                                success = true;
                            }
                            client.destroy();
                            resolve();
                        });

                        client.on('error', (err) => {
                            results.push(`Error: ${err.message}`);
                            client.destroy();
                            reject(err);
                        });
                    });

                    // Add a delay to ensure the printer has time to process
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms delay
                } catch (error) {
                    results.push(`Error: ${error.message}`);
                    attempt++;
                    if (attempt < maxRetries) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, retryDelay),
                        ); // Wait before retrying
                    }
                }
            }
        }

        return results;
    }

    async sendCommandToPrinter(commandDto: CommandDto2): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                // Validate command type
                if (!Object.values(PacketType).includes(commandDto.type)) {
                    throw new Error('Invalid type');
                }

                const packet = this.createProtocolPacket(
                    commandDto.type as PacketType,
                    commandDto.data,
                    commandDto.data2,
                );
                const checksum = this.calculateChecksum(packet);

                this.logger.log('Sending packet:', packet); // Debug log

                const client = new net.Socket();

                // ip LAMA = 192.168.7.22
                // ip NEW = 192.168.6.210
                client.connect(3100, '192.168.6.210', () => {
                    client.write(packet);
                });

                client.on('data', (data) => {
                    const response = data.toString();
                    this.logger.log('Response from printer:', response); // Debug log
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
            } catch (error) {
                this.logger.log('Error in sendCommandToPrinter:', error); // Debug log
                reject(`Error: ${error.message}`);
            }
        });
    }

    async setPrintOnOff(status: '0' | '1'): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                // 'O' is the type for Print On/Off
                const packet = this.createProtocolPacket(
                    PacketType.PrintOnOff,
                    status,
                );

                console.log(`${PacketType.PrintOnOff}${status}`);

                const client = new net.Socket();

                client.connect(3100, '192.168.6.210', () => {
                    this.logger.log('Koneksi ke mesin berhasil');
                    client.write(packet);
                });

                client.on('data', (data) => {
                    const response = data.toString().trim();
                    this.logger.log('Respons dari mesin:', response);

                    if (response.startsWith('$')) {
                        resolve('Perintah berhasil dijalankan');
                    } else if (response.startsWith('!')) {
                        reject('Perintah gagal');
                    } else {
                        reject('Format respons tidak valid');
                    }

                    client.destroy();
                });

                client.on('error', (err) => {
                    this.logger.error('Error koneksi:', err.message);
                    reject(`Error koneksi: ${err.message}`);
                });

                client.on('close', () => {
                    this.logger.log('Koneksi ditutup');
                });
            } catch (error) {
                this.logger.error('Error di setPrintOnOff:', error.message);
                reject(`Error: ${error.message}`);
            }
        });
    }
}
