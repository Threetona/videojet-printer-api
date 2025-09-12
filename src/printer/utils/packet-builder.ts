import { PacketType } from '../types/packet-type.enum';
import { calculateChecksum } from './checksum';

export function createProtocolPacket(
    type: PacketType,
    dataFields: string[] = [],
): string {
    const STX = String.fromCharCode(0x02);
    const ETX = String.fromCharCode(0x03);
    const LF = String.fromCharCode(0x0a); // Line Feed (LF) as separator

    // Construct the packet
    const data = dataFields.join(LF);
    const packet = `${STX}${type}${data}${ETX}`;

    // Calculate and append checksum
    const checksum = calculateChecksum(packet);
    return `${packet}${checksum}`;
}
