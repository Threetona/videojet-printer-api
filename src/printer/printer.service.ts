import * as net from 'net';
import { Injectable, Logger } from '@nestjs/common';
import { PacketType } from './types/packet-type.enum';
import { PrintOnOffDto } from './dto/print-on-off.dto';
import { MessageDataDto } from './dto/message-data.dto';
import { createProtocolPacket } from './utils/packet-builder';
import { MessageSelectDto } from './dto/message-select.dto';
import { UpdateMultyUserFieldDto } from './dto/update-multy-user-field.dto';

@Injectable()
export class PrinterService {
    private readonly logger = new Logger(PrinterService.name);

    // Method to status the jet
    async getErrorStatus(
        IP: string,
        Port: number,
    ): Promise<{ errorStatus: string; message: string }> {
        return new Promise((resolve, reject) => {
            const packet = createProtocolPacket(PacketType.RequestErrorStatus);

            const client = new net.Socket();
            client.connect(Port, IP, () => {
                this.logger.log(`Sending packet: ${packet}`);
                client.write(packet);
            });

            client.on('data', (data) => {
                const response = data.toString();
                this.logger.log(`Received response: ${response}`);

                // Process the response
                const errorStatus = response.substring(1, 13); // EEEEEE field (6 bytes)
                const alarmStatus = response.substring(13, 14); // A field (1 byte)

                const message = this.generateErrorStatusMessage(
                    errorStatus,
                    alarmStatus,
                );

                resolve({ errorStatus, message });
                client.destroy(); // Close connection after data is received
            });

            client.on('error', (err) => {
                this.logger.error(`Connection error: ${err.message}`);
                reject(`Error: ${err.message}`);
            });
        });
    }

    async startJet(IP: string, Port: number): Promise<string> {
        return new Promise((resolve, reject) => {
            // Coba format perintah yang lebih sederhana, misalnya hanya "1510CMD"
            const packet = createProtocolPacket(PacketType.StartJet, [
                '1510CMD',
            ]);

            const client = new net.Socket();
            client.setTimeout(50000); // Timeout untuk koneksi dan data

            client.connect(Port, IP, () => {
                this.logger.log(`Sending Start Jet packet: ${packet}`);
                client.write(packet);
            });

            client.on('data', (data) => {
                const response = data.toString();
                this.logger.log(`Received response: ${response}`);
                this.logger.log(`Raw response data: ${data.toString('hex')}`);

                // Interpretasi respons
                if (response.startsWith('$')) {
                    resolve('Start Jet command executed successfully');
                } else if (response.startsWith('!')) {
                    reject(`Start Jet command failed. Error: ${response}`);
                } else {
                    reject(`Unexpected response: ${response}`);
                }
                client.destroy();
            });

            client.on('error', (err) => {
                this.logger.error(`Connection error: ${err.message}`);
                reject(`Error: ${err.message}`);
            });

            client.on('timeout', () => {
                client.destroy();
                reject('Connection timed out');
            });
        });
    }

    // Method to stop the jet
    async stopJet(IP: string, Port: number): Promise<string> {
        return new Promise((resolve, reject) => {
            // Format the packet according to documentation
            const packet = createProtocolPacket(PacketType.StopJet);

            const client = new net.Socket();
            client.setTimeout(50000); // Timeout for connection and data

            client.connect(Port, IP, () => {
                this.logger.log(`Sending Stop Jet packet: ${packet}`);
                client.write(packet);
            });

            client.on('data', (data) => {
                const response = data.toString();
                this.logger.log(`Received response: ${response}`);
                this.logger.log(`Raw response data: ${data.toString('hex')}`);

                // Interpret the response
                if (response.startsWith('$')) {
                    resolve('Stop Jet command executed successfully');
                } else if (response.startsWith('!')) {
                    reject('Stop Jet command failed');
                } else {
                    reject(`Unexpected response: ${response}`);
                }
                client.destroy();
            });

            client.on('error', (err) => {
                this.logger.error(`Connection error: ${err.message}`);
                reject(`Error: ${err.message}`);
            });

            client.on('timeout', () => {
                client.destroy();
                reject('Connection timed out');
            });
        });
    }

    /**
     * Turns On or Off printing.
     * @param printOn '0' to turn off printing, '1' to turn on printing.
     * @returns A promise that resolves with the printer's response.
     */
    async printOnOff(printOnOffDto: PrintOnOffDto): Promise<string> {
        return new Promise((resolve, reject) => {
            const packet = createProtocolPacket(PacketType.PrintOnOff, [
                printOnOffDto.printOn,
            ]);

            const client = new net.Socket();
            client.setTimeout(5000); // Set timeout for the connection

            client.connect(printOnOffDto.Port, printOnOffDto.IpAddress, () => {
                this.logger.log(`Sending Print On/Off packet: ${packet}`);
                client.write(packet);
            });

            client.on('data', (data) => {
                const response = data.toString();
                this.logger.log(`Received response: ${response}`);

                if (response.startsWith('$')) {
                    if (response === '$7F') {
                        resolve('Print turned off successfully');
                    } else if (response === '$80') {
                        resolve('Print turned on successfully');
                    } else {
                        resolve('Print command acknowledged, status unknown');
                    }
                } else if (response.startsWith('!')) {
                    // Add handling for other responses if needed
                    resolve('Print command acknowledged with possible error');
                } else {
                    resolve(`Unexpected response format: ${response}`);
                }

                client.destroy(); // Ensure client is destroyed after response
            });

            client.on('timeout', () => {
                this.logger.error('Connection timed out');
                client.destroy();
                reject('Connection timed out');
            });

            client.on('error', (err) => {
                this.logger.error(`Connection error: ${err.message}`);
                client.destroy();
                reject(`Error: ${err.message}`);
            });
        });
    }

    async selectMessage(dto: MessageSelectDto): Promise<string> {
        return new Promise((resolve, reject) => {
            const packet = createProtocolPacket(PacketType.MessageSelect, [
                dto.messageName,
            ]);

            const client = new net.Socket();
            client.connect(dto.Port, dto.IpAddress, () => {
                this.logger.log(`Sending Message Select packet: ${packet}`);
                client.write(packet);
            });

            client.on('data', (data) => {
                const response = data.toString();
                this.logger.log(`Received response: ${response}`);

                if (response.startsWith('$')) {
                    resolve('Message selected successfully');
                } else if (response.startsWith('!')) {
                    reject('Failed to select message');
                }
                client.destroy();
            });

            client.on('error', (err) => {
                this.logger.error(`Connection error: ${err.message}`);
                reject(`Error: ${err.message}`);
            });
        });
    }

    async deleteMessageText(IP: string, Port: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const packet = createProtocolPacket(PacketType.DeleteMessageText);

            const client = new net.Socket();
            client.setTimeout(5000); // Set timeout for the connection

            client.connect(Port, IP, () => {
                this.logger.log(
                    `Sending Delete Message Text packet: ${packet}`,
                );
                client.write(packet);
            });

            client.on('data', (data) => {
                const response = data.toString();
                this.logger.log(`Received response: ${response}`);

                // Assuming successful operation if response starts with '$' (adjust as needed)
                if (response.startsWith('$')) {
                    resolve('Message text cleared successfully');
                } else {
                    reject(`Unexpected response format or error: ${response}`);
                }

                client.destroy(); // Ensure client is destroyed after response
            });

            client.on('timeout', () => {
                this.logger.error('Connection timed out');
                client.destroy();
                reject('Connection timed out');
            });

            client.on('error', (err) => {
                this.logger.error(`Connection error: ${err.message}`);
                client.destroy();
                reject(`Error: ${err.message}`);
            });
        });
    }

    // masih perlu di perbaiki belum ketemu
    async updateMessageText(
        messageName: string,
        messageData: MessageDataDto[],
        IpAddress: string,
        Port: number,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            // Prepare the message data fields
            const formattedDataFields = messageData.map((data) => {
                // Ensure HORC and VERC are correctly zero-padded
                const horc = data.horc.padStart(4, '0');
                const verc = data.verc.padStart(3, '0');

                // Create the message data field string
                return `${data.fontNum}${horc}${verc}${data.attrib}${data.messageText}`;
            });

            // Send packet using the formatted data fields
            const packet = createProtocolPacket(PacketType.UpdateMessageText, [
                messageName,
                ...formattedDataFields,
            ]);

            const client = new net.Socket();
            client.setTimeout(10000); // Increase timeout to 10 seconds

            client.connect(Port, IpAddress, () => {
                this.logger.log(
                    `Sending Update Message Text packet: ${packet}`,
                );
                client.write(packet);
            });

            client.on('data', (data) => {
                const response = data.toString();
                this.logger.log(`Received response: ${response}`);

                if (response.startsWith('$')) {
                    resolve('Message text updated successfully');
                } else {
                    reject(`Unexpected response format or error: ${response}`);
                }

                client.destroy();
            });

            client.on('timeout', () => {
                this.logger.error('Connection timed out');
                client.destroy();
                reject('Connection timed out');
            });

            client.on('error', (err) => {
                this.logger.error(`Connection error: ${err.message}`);
                client.destroy();
                reject(`Error: ${err.message}`);
            });
        });
    }

    async updateUserFieldData(
        userFieldName: string,
        userFieldData: string,
        IpAddress: string,
        Port: number,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const packet = createProtocolPacket(
                PacketType.UpdateUserFieldData,
                [userFieldName, userFieldData],
            );

            const client = new net.Socket();
            client.setTimeout(5000); // Set timeout for the connection

            client.connect(Port, IpAddress, () => {
                this.logger.log(
                    `Sending Update User Field Data packet: ${packet}`,
                );
                client.write(packet);
            });

            client.on('data', (data) => {
                const response = data.toString();
                this.logger.log(`Received response: ${response}`);

                // Check the response based on the expected format
                if (response.startsWith('$')) {
                    resolve('User field data updated successfully');
                } else {
                    reject(`Unexpected response format or error: ${response}`);
                }

                client.destroy(); // Ensure client is destroyed after response
            });

            client.on('timeout', () => {
                this.logger.error('Connection timed out');
                client.destroy();
                reject('Connection timed out');
            });

            client.on('error', (err) => {
                this.logger.error(`Connection error: ${err.message}`);
                client.destroy();
                reject(`Error: ${err.message}`);
            });
        });
    }

    async updateMultyUserField(
        userFieldDto: UpdateMultyUserFieldDto,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const packets = userFieldDto.messageData.map((field) =>
                createProtocolPacket(PacketType.UpdateUserFieldData, [
                    field.userFieldName,
                    field.userFieldData,
                ]),
            );
            const client = new net.Socket();
            client.setTimeout(60000);
            // console.log(userFieldDto.IpAddress);
            // console.log(userFieldDto.Port);
            client.connect(userFieldDto.Port, userFieldDto.IpAddress, () => {
                packets.forEach((packet) => {
                    this.logger.log(
                        `Sending Update User Field Data packet: ${packet}`,
                    );
                    client.write(packet);
                });
            });
            client.on('data', (data) => {
                const response = data.toString();
                this.logger.log(`Received response: ${response}`);
                if (response.startsWith('$')) {
                    resolve('User fields updated successfully');
                } else {
                    reject(`Unexpected response format or error: ${response}`);
                }
                client.destroy(); // Ensure client is destroyed after response
            });
            client.on('timeout', () => {
                this.logger.error('Connection timed out');
                client.destroy();
                reject('Connection timed out');
            });
            client.on('error', (err) => {
                this.logger.error(`Connection error: ${err.message}`);
                client.destroy();
                reject(`Error: ${err.message}`);
            });
        });
    }

    private generateErrorStatusMessage(
        errorStatus: string,
        alarmStatus: string,
    ): string {
        if (errorStatus === '000000') {
            return 'Printer berjalan normal, tidak ada error yang terdeteksi.';
        }

        // let message = 'Info terdeteksi pada printer:\n';
        let message = 'Info :';

        if (parseInt(errorStatus, 16) & 0x1) {
            message +=
                '- Error pada sistem pengisian muatan (Charge system error)\n';
        }
        if (parseInt(errorStatus, 16) & 0x2) {
            message += ' Kesalahan pada pompa (Pump fault)\n';
        }
        // Add more conditions based on error status bits

        if (alarmStatus) {
            message += '\nStatus Alarm:\n';
            if (parseInt(alarmStatus, 16) & 0x4) {
                message += '- Red Trafficator On\n';
            }
            if (parseInt(alarmStatus, 16) & 0x2) {
                message += '- Amber Trafficator On\n';
            }
            if (parseInt(alarmStatus, 16) & 0x1) {
                message += '- Green Trafficator On\n';
            }
        } else {
            message += '\nTidak ada alarm yang terdeteksi.';
        }

        return message;
    }
}
